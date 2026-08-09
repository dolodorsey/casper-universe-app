-- Stock the public CASPER Customer catalog with the twelve approved brand realms
-- and a launch knowledge pack. This migration is intentionally idempotent.

insert into public.brands (
  id, name, tagline, description, primary_color, secondary_color, is_active, sort_order
)
values
  ('angel-wings', 'Angel Wings', 'Heaven-sent heat', 'Crispy food, divine energy, and a bold wing-first realm.', '#F97316', '#2A1005', true, 1),
  ('tha-morning-after', 'Tha Morning After', 'Wake up legendary', 'An all-day brunch and recovery realm built around memorable mornings.', '#D89A2B', '#2B1A07', true, 2),
  ('patty-daddy', 'Patty Daddy', 'Bigger. Bolder. Daddy.', 'A burger realm driven by power, personality, and unapologetic flavor.', '#D7B46A', '#24190B', true, 3),
  ('espresso-co', 'Espresso Co.', 'Science of the perfect cup', 'A precise coffee realm focused on speed, ritual, and craft.', '#8A6A3A', '#1D160D', true, 4),
  ('mojo-juice', 'Mojo Juice', 'Fuel the ritual', 'A fresh and functional juice realm built for everyday momentum.', '#63A647', '#10240D', true, 5),
  ('mr-oyster', 'Mr. Oyster', 'The deep end of flavor', 'An ocean-led realm designed around seafood and occasion.', '#4C86A8', '#0D1E29', true, 6),
  ('sweet-tooth', 'Sweet Tooth', 'Indulgence engineered', 'A dessert realm made for treats, celebration, and collectible moments.', '#D74B9B', '#2A0D20', true, 7),
  ('taco-yaki', 'Taco Yaki', 'Fire meets flavor', 'A high-energy fusion realm where tacos, heat, and crunch meet.', '#EF4444', '#2A0909', true, 8),
  ('tossd', 'Toss''d', 'Fresh. Fast. No excuses.', 'A wellness-forward realm centered on freshness and speed.', '#61A146', '#10220D', true, 9),
  ('pasta-bish', 'Pasta Bish', 'Comfort with attitude', 'A pasta realm where sauce, comfort, and personality lead.', '#C9473E', '#270C09', true, 10),
  ('peace-pizza', 'Peace Pizza', 'Good slices. Good energy.', 'A pizza realm created around community, sharing, and good energy.', '#F28C28', '#2B1305', true, 11),
  ('american-dragon', 'American Dragon', 'Luxury takeout. American fire.', 'A gold-toned night-market realm with a fire-forged identity.', '#D9A52E', '#251A05', true, 12)
on conflict (id) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  description = excluded.description,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

with realm_content(brand_id, title, body, sort_order) as (
  values
    ('angel-wings', 'Enter Angel Wings', 'Discover the approved Angel Wings identity and future verified activations.', 1),
    ('tha-morning-after', 'Enter Tha Morning After', 'Discover the approved brunch identity and future verified activations.', 2),
    ('patty-daddy', 'Enter Patty Daddy', 'Discover the approved Patty Daddy identity and future verified activations.', 3),
    ('espresso-co', 'Enter Espresso Co.', 'Discover the approved Espresso Co. identity and future verified activations.', 4),
    ('mojo-juice', 'Enter Mojo Juice', 'Discover the approved Mojo Juice identity and future verified activations.', 5),
    ('mr-oyster', 'Enter Mr. Oyster', 'Discover the approved Mr. Oyster identity and future verified activations.', 6),
    ('sweet-tooth', 'Enter Sweet Tooth', 'Discover the approved Sweet Tooth identity and future verified activations.', 7),
    ('taco-yaki', 'Enter Taco Yaki', 'Discover the approved Taco Yaki identity and future verified activations.', 8),
    ('tossd', 'Enter Toss''d', 'Discover the approved Toss''d identity and future verified activations.', 9),
    ('pasta-bish', 'Enter Pasta Bish', 'Discover the approved Pasta Bish identity and future verified activations.', 10),
    ('peace-pizza', 'Enter Peace Pizza', 'Discover the approved Peace Pizza identity and future verified activations.', 11),
    ('american-dragon', 'Enter American Dragon', 'Discover the approved American Dragon identity and future verified activations.', 12)
)
insert into public.brand_content_blocks (brand_id, type, title, body, cta_label, cta_action, sort_order, is_active)
select brand_id, 'realm_intro', title, body, 'Explore realm', '/realms/' || brand_id, sort_order, true
from realm_content source
where not exists (
  select 1 from public.brand_content_blocks existing
  where existing.brand_id = source.brand_id and existing.type = 'realm_intro'
);

with mascot_seed(id, brand_id, name, bio, rarity, sort_order) as (
  values
    ('loudini', 'angel-wings', 'Loudini the Wing Wizard', 'The bold guide to the Angel Wings realm.', 'founder', 1),
    ('eggavier', 'tha-morning-after', 'Eggavier & Scrambalina', 'The brunch duo guiding Tha Morning After.', 'founder', 2),
    ('paddy-daddy', 'patty-daddy', 'Paddy Daddy', 'The larger-than-life face of Patty Daddy.', 'founder', 3),
    ('beanzo', 'espresso-co', 'Beanzo the Barista', 'The precision-minded guide to Espresso Co.', 'founder', 4),
    ('mojo-mango', 'mojo-juice', 'Mojo the Mango', 'The energetic guide to Mojo Juice.', 'founder', 5),
    ('sir-shellington', 'mr-oyster', 'Sir Shellington', 'The polished guide to the Mr. Oyster realm.', 'founder', 6),
    ('sweetness', 'sweet-tooth', 'Sweetness', 'The celebratory guide to Sweet Tooth.', 'founder', 7),
    ('baby-panda-chef', 'taco-yaki', 'Baby Panda Chef', 'The fusion-minded guide to Taco Yaki.', 'founder', 8),
    ('leaf-boss', 'tossd', 'Leaf Boss', 'The fresh-fast guide to Toss''d.', 'founder', 9),
    ('noodle-queen', 'pasta-bish', 'Noodle Queen', 'The saucy guide to Pasta Bish.', 'founder', 10),
    ('peace-the-pizza', 'peace-pizza', 'Peace the Pizza', 'The community guide to Peace Pizza.', 'founder', 11),
    ('american-dragon-mascot', 'american-dragon', 'The American Dragon', 'The fire-forged guide to American Dragon.', 'founder', 12)
)
insert into public.mascots (id, brand_id, name, bio, rarity, sort_order, is_active)
select id, brand_id, name, bio, rarity, sort_order, true from mascot_seed
on conflict (id) do update set
  brand_id = excluded.brand_id,
  name = excluded.name,
  bio = excluded.bio,
  rarity = excluded.rarity,
  sort_order = excluded.sort_order,
  is_active = true;

insert into public.trivia_packs (brand_id, title, description, difficulty, tags, is_daily, is_active)
select null, 'Know the CASPER Universe', 'A twelve-question introduction to the independent CASPER food and beverage realms.', 'intro', array['casper', 'brands', 'launch'], false, true
where not exists (
  select 1 from public.trivia_packs where title = 'Know the CASPER Universe'
);

with target_pack as (
  select id from public.trivia_packs where title = 'Know the CASPER Universe' order by id limit 1
), question_seed(question, choices, answer_index, explanation, sort_order) as (
  values
    ('Which realm is built around wings and heaven-sent heat?', '["Angel Wings","Peace Pizza","Toss''d","Espresso Co."]'::jsonb, 0, 'Angel Wings is the wing-first realm.', 1),
    ('Which realm is centered on all-day brunch and recovery?', '["Mojo Juice","Tha Morning After","Mr. Oyster","Patty Daddy"]'::jsonb, 1, 'Tha Morning After is the brunch and recovery realm.', 2),
    ('Which realm is the burger brand?', '["Sweet Tooth","Patty Daddy","Pasta Bish","Taco Yaki"]'::jsonb, 1, 'Patty Daddy is the burger realm.', 3),
    ('Which realm focuses on precision coffee craft?', '["Espresso Co.","Mojo Juice","American Dragon","Angel Wings"]'::jsonb, 0, 'Espresso Co. is the coffee realm.', 4),
    ('Which realm is fresh, functional, and juice-led?', '["Toss''d","Mojo Juice","Peace Pizza","Mr. Oyster"]'::jsonb, 1, 'Mojo Juice is the juice realm.', 5),
    ('Which realm is seafood-led?', '["Mr. Oyster","Pasta Bish","Angel Wings","Tha Morning After"]'::jsonb, 0, 'Mr. Oyster is the seafood realm.', 6),
    ('Which realm is designed around dessert and celebration?', '["Sweet Tooth","Taco Yaki","Patty Daddy","Espresso Co."]'::jsonb, 0, 'Sweet Tooth is the dessert realm.', 7),
    ('Which realm combines tacos, fusion, heat, and crunch?', '["Peace Pizza","Taco Yaki","American Dragon","Mojo Juice"]'::jsonb, 1, 'Taco Yaki is the fusion taco realm.', 8),
    ('Which realm is freshness and wellness-forward?', '["Toss''d","Sweet Tooth","Pasta Bish","Angel Wings"]'::jsonb, 0, 'Toss''d is the wellness-forward fresh realm.', 9),
    ('Which realm pairs pasta comfort with attitude?', '["Pasta Bish","Mr. Oyster","Patty Daddy","Peace Pizza"]'::jsonb, 0, 'Pasta Bish is the pasta realm.', 10),
    ('Which realm is built around slices, sharing, and community?', '["American Dragon","Peace Pizza","Espresso Co.","Mojo Juice"]'::jsonb, 1, 'Peace Pizza is the pizza realm.', 11),
    ('Which realm uses a gold-toned, fire-forged night-market identity?', '["Angel Wings","Sweet Tooth","American Dragon","Tha Morning After"]'::jsonb, 2, 'American Dragon carries the fire-forged identity.', 12)
)
insert into public.trivia_questions (pack_id, question, type, choices, answer_index, explanation, points_awarded, sort_order, is_active)
select target_pack.id, seed.question, 'multiple_choice', seed.choices, seed.answer_index, seed.explanation, 0, seed.sort_order, true
from target_pack cross join question_seed seed
where not exists (
  select 1 from public.trivia_questions existing
  where existing.pack_id = target_pack.id and existing.sort_order = seed.sort_order
);

-- Explicit grants keep the public catalog reachable as Supabase tightens
-- Data API defaults. RLS remains the row-level authorization layer.
grant select on public.brands, public.brand_content_blocks, public.mascots,
  public.trivia_packs, public.trivia_questions to anon, authenticated;
