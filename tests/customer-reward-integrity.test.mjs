import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../lib/rewards.ts',import.meta.url),'utf8');
const migration=fs.readFileSync(new URL('../supabase/migrations/20260819024800_customer_reward_integrity.sql',import.meta.url),'utf8');

test('CASPER Universe has no invented synchronous customer rewards',()=>{
  assert.match(source,/export const REWARDS: Reward\[\] = \[\]/);
  assert.doesNotMatch(source,/Free Drink|Priority Line Access|Secret Menu Access|Golden Ticket/);
  assert.match(source,/loadPublishableRewards/);
  assert.match(source,/casper_rewards_intelligence/);
});

test('claimable rewards require inventory and current terms',()=>{
  assert.match(migration,/inventory_available/);
  assert.match(migration,/cost_points>0/);
  assert.match(migration,/updated_at>=now\(\)-interval '90 days'/);
  assert.match(migration,/publishable_now/);
});
