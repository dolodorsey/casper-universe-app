import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const migration = await readFile(new URL('../supabase/migrations/20260809010000_stock_casper_customer_catalog.sql', import.meta.url), 'utf8');
const brandSource = await readFile(new URL('../data/brands.ts', import.meta.url), 'utf8');

const approvedSlugs = [
  'angel-wings', 'tha-morning-after', 'patty-daddy', 'espresso-co',
  'mojo-juice', 'mr-oyster', 'sweet-tooth', 'taco-yaki', 'tossd',
  'pasta-bish', 'peace-pizza', 'american-dragon',
];

test('customer catalog contains exactly the twelve approved brand slugs', () => {
  for (const slug of approvedSlugs) {
    assert.match(brandSource, new RegExp(`slug: ["']${slug}["']`));
    assert.match(migration, new RegExp(`'${slug}'`));
  }
  assert.equal(new Set(approvedSlugs).size, 12);
});

test('customer seed is idempotent and never fabricates point awards', () => {
  assert.match(migration, /on conflict \(id\) do update/i);
  assert.match(migration, /where not exists/i);
  assert.match(migration, /points_awarded, sort_order/);
  assert.match(migration, /seed\.explanation, 0, seed\.sort_order/);
});
