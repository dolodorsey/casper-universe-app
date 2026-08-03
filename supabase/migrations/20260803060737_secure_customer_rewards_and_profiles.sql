-- Customer identity and balances are private.
drop policy if exists "Public can view profiles" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

-- Prevent a customer from promoting their own role.
revoke update on public.profiles from authenticated;
grant update (handle, display_name, avatar_url, home_city) on public.profiles to authenticated;

drop policy if exists "Public can read user_stats" on public.user_stats;
create policy user_stats_select_own on public.user_stats
  for select to authenticated using ((select auth.uid()) = user_id);

-- Point values can only originate from verified server-side reward flows.
drop policy if exists "Users can insert own ledger entries" on public.points_ledger;
revoke insert, update, delete on public.points_ledger from anon, authenticated;

-- Tokens are secrets until redeemed; never enumerate them through the Data API.
drop policy if exists qr_tokens_select_all on public.qr_tokens;
revoke select, insert, update, delete on public.qr_tokens from anon, authenticated;

-- Legacy functions either trust caller-supplied identities/scores or are triggers.
revoke execute on function public.bootstrap_new_user() from public, anon, authenticated;
revoke execute on function public.universe_handle_new_user() from public, anon, authenticated;
revoke execute on function public.universe_apply_points_ledger() from public, anon, authenticated;
revoke execute on function public.rpc_award_points(uuid,text,integer,text) from public, anon, authenticated;
revoke execute on function public.rpc_complete_trivia_session(uuid,integer,integer) from public, anon, authenticated;
revoke execute on function public.rpc_evaluate_unlocks(uuid) from public, anon, authenticated;
revoke execute on function public.rpc_scan_qr(uuid,uuid) from public, anon, authenticated;

create or replace function public.redeem_qr_token(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_qr public.qr_tokens%rowtype;
  v_scans integer;
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  select * into v_qr
  from public.qr_tokens
  where token = trim(p_token) and is_active = true
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Invalid or inactive code');
  end if;

  if exists (
    select 1 from public.qr_redemptions
    where user_id = v_uid and token = v_qr.token
  ) then
    return jsonb_build_object('success', false, 'error', 'Code already redeemed');
  end if;

  insert into public.daily_caps (user_id, cap_date, scans_today)
  values (v_uid, current_date, 0)
  on conflict (user_id, cap_date) do nothing;

  select scans_today into v_scans from public.daily_caps
  where user_id = v_uid and cap_date = current_date
  for update;

  if coalesce(v_scans, 0) >= 5 then
    return jsonb_build_object('success', false, 'error', 'Daily scan limit reached');
  end if;

  insert into public.qr_redemptions (user_id, token)
  values (v_uid, v_qr.token);

  update public.daily_caps set scans_today = scans_today + 1
  where user_id = v_uid and cap_date = current_date;

  insert into public.points_ledger (user_id, event_type, delta, meta)
  values (
    v_uid,
    'verified_qr',
    greatest(0, least(v_qr.points, 500)),
    jsonb_build_object('brand_id', v_qr.brand_slug, 'token_id', v_qr.id)
  );

  return jsonb_build_object(
    'success', true,
    'points_earned', greatest(0, least(v_qr.points, 500)),
    'brand_id', v_qr.brand_slug
  );
end;
$$;

revoke execute on function public.redeem_qr_token(text) from public, anon;
grant execute on function public.redeem_qr_token(text) to authenticated;

create unique index if not exists qr_redemptions_user_token_unique
  on public.qr_redemptions (user_id, token);
