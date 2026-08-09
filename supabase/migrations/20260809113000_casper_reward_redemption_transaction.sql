create unique index if not exists reward_redemptions_code_uidx
  on public.reward_redemptions(code)
  where code is not null;

create or replace function public.redeem_reward(p_reward_id uuid)
returns jsonb
language plpgsql
security definer
set search_path='pg_catalog','public'
as $$
declare
  v_uid uuid := auth.uid();
  v_reward public.rewards_catalog%rowtype;
  v_total integer := 0;
  v_remaining integer := 0;
  v_take integer := 0;
  v_code text;
  v_redemption_id uuid;
  v_redeemed_count integer := 0;
  v_row record;
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode='42501';
  end if;

  select * into v_reward
  from public.rewards_catalog
  where id=p_reward_id and coalesce(is_active,true)=true
  for update;

  if not found then
    return jsonb_build_object('success',false,'error','Reward is unavailable.');
  end if;

  insert into public.profiles(id)
  values(v_uid)
  on conflict(id) do nothing;

  perform 1
  from public.user_stats
  where user_id=v_uid
  for update;

  select coalesce(sum(greatest(points_balance,0)),0)::integer
  into v_total
  from public.user_stats
  where user_id=v_uid;

  if v_total < v_reward.cost_points then
    return jsonb_build_object(
      'success',false,
      'error','Not enough points for this reward.',
      'points_required',v_reward.cost_points,
      'points_available',v_total
    );
  end if;

  if v_reward.inventory_limit is not null then
    select count(*)::integer into v_redeemed_count
    from public.reward_redemptions
    where reward_id=v_reward.id
      and coalesce(status,'issued') not in ('cancelled','canceled','void','refunded');

    if v_redeemed_count >= v_reward.inventory_limit then
      return jsonb_build_object('success',false,'error','This reward is sold out.');
    end if;
  end if;

  v_remaining := v_reward.cost_points;

  for v_row in
    select brand_id, points_balance
    from public.user_stats
    where user_id=v_uid and points_balance > 0
    order by case when v_reward.brand_id is not null and brand_id=v_reward.brand_id then 0 else 1 end,
             points_balance desc,
             brand_id
    for update
  loop
    exit when v_remaining <= 0;
    v_take := least(v_remaining, v_row.points_balance);

    insert into public.points_ledger(user_id,event_type,delta,meta)
    values(
      v_uid,
      'reward_redemption',
      -v_take,
      jsonb_build_object(
        'brand_id',v_row.brand_id,
        'reward_id',v_reward.id,
        'reward_title',v_reward.title
      )
    );

    v_remaining := v_remaining - v_take;
  end loop;

  if v_remaining > 0 then
    raise exception 'Reward point reconciliation failed';
  end if;

  loop
    v_code := 'CAS-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,12));
    exit when not exists(select 1 from public.reward_redemptions where code=v_code);
  end loop;

  insert into public.reward_redemptions(user_id,reward_id,status,code,meta)
  values(
    v_uid,
    v_reward.id,
    'issued',
    v_code,
    jsonb_build_object(
      'reward_title',v_reward.title,
      'points_spent',v_reward.cost_points,
      'brand_id',v_reward.brand_id
    )
  )
  returning id into v_redemption_id;

  return jsonb_build_object(
    'success',true,
    'redemption_id',v_redemption_id,
    'reward_id',v_reward.id,
    'reward_title',v_reward.title,
    'points_spent',v_reward.cost_points,
    'points_remaining',v_total-v_reward.cost_points,
    'code',v_code,
    'status','issued'
  );
end;
$$;

revoke all on function public.redeem_reward(uuid) from public, anon;
grant execute on function public.redeem_reward(uuid) to authenticated;
