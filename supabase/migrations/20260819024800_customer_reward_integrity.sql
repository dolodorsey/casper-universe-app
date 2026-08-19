create or replace view public.casper_rewards_intelligence as
with usage as (
  select reward_id,
         count(*) filter (where coalesce(status,'redeemed') not in ('cancelled','void','rejected'))::integer as used_count
  from public.reward_redemptions
  group by reward_id
)
select r.*,
       coalesce(u.used_count,0) as used_count,
       case when r.inventory_limit is null then null else greatest(r.inventory_limit-coalesce(u.used_count,0),0) end as remaining_inventory,
       case when r.inventory_limit is null then true else coalesce(u.used_count,0)<r.inventory_limit end as inventory_available,
       case when r.updated_at>=now()-interval '90 days' then 'current' else 'stale' end as terms_freshness,
       (r.is_active and r.cost_points>0 and (r.inventory_limit is null or coalesce(u.used_count,0)<r.inventory_limit) and r.updated_at>=now()-interval '90 days') as publishable_now
from public.rewards_catalog r
left join usage u on u.reward_id=r.id;

grant select on public.casper_rewards_intelligence to anon,authenticated;
comment on view public.casper_rewards_intelligence is 'CASPER Universe customer reward truth layer. Active flag alone is insufficient: inventory, positive point cost and current terms are required before customer publication.';
