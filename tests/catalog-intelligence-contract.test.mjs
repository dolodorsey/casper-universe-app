import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const catalog=fs.readFileSync(new URL('../lib/catalog.ts',import.meta.url),'utf8');
const seed=fs.readFileSync(new URL('../supabase/migrations/20260809010000_stock_casper_customer_catalog.sql',import.meta.url),'utf8');

test('CASPER Universe realm order is presentation curation, not product availability or popularity',()=>{
  assert.match(catalog,/from\('brands'\)/);
  assert.match(catalog,/\.eq\('is_active', true\)/);
  assert.match(catalog,/\.order\('sort_order'\)/);
  assert.doesNotMatch(catalog,/inventory|on_hand|best_seller|rating|review_count|popularity/i);
});

test('customer realm copy does not make unverified activation claims',()=>{
  assert.match(seed,/future verified activations/g);
  assert.doesNotMatch(seed,/available now|in stock|open now|best seller|top rated/i);
});
