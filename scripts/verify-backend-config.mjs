import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [appConfig, easConfig, clientSource, publicEnvironment, seedMigration] = await Promise.all([
  readFile(new URL('../app.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../eas.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../lib/supabase.ts', import.meta.url), 'utf8'),
  readFile(new URL('../.env.production', import.meta.url), 'utf8'),
  readFile(new URL('../supabase/migrations/20260809010000_stock_casper_customer_catalog.sql', import.meta.url), 'utf8'),
]);

assert.equal(appConfig.expo.ios.bundleIdentifier, 'com.caspergroup.universe');
assert.equal(appConfig.expo.android.package, 'com.caspergroup.universe');
assert.equal(easConfig.build.production.autoIncrement, true);
assert.match(clientSource, /EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
assert.doesNotMatch(clientSource, /service_role|sb_secret_/);
assert.match(publicEnvironment, /EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_/);
assert.doesNotMatch(publicEnvironment, /eyJhbGci|service_role|sb_secret_/);
assert.match(seedMigration, /Know the CASPER Universe/);

console.log('CASPER Customer backend and release contracts verified.');
