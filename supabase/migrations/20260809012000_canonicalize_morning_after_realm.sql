-- The current product source names the realm "Tha Morning After". Preserve the
-- legacy record for historical references while removing it from public lists.
update public.brands
set is_active = false
where id = 'morning-after';

-- Mr. Lu is the approved American Dragon mascot; keep the generic migration
-- artifact for history but do not expose it as a collectible.
insert into public.mascots (id, brand_id, name, bio, rarity, sort_order, is_active)
values ('mascot-mr-lu', 'american-dragon', 'Mr. Lu', 'The fire-forged guide to American Dragon.', 'founder', 12, true)
on conflict (id) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  bio = excluded.bio,
  rarity = excluded.rarity,
  sort_order = excluded.sort_order,
  is_active = true;

update public.mascots
set is_active = false
where id = 'american-dragon-mascot';
