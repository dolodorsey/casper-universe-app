# Casper Universe Release Handoff

## Canonicalization status

- Proposed repository: `dolodorsey/casper-universe-app`
- Proposed database: Casper Universe `rvplisxkjsoyfbkyusga`
- Parallel systems: The Casper Group `qhgmukwoennurwuvmbhy`, MCP Gateway Casper tables, CASPER-GROUP-BOH, and prior Casper generations
- Current release status: blocked

## Release rule

No Casper system may be declared canonical, deleted, or used for a broad migration until every repo, database, deployment, domain, mobile build, user group, and integration is inventoried and labeled.

## Required checks

1. Run `npm ci`.
2. Run `node --test tests/*.test.mjs`.
3. Run `npm run build`.
4. Confirm `/health.json` remains blocked until canonicalization is signed off.
5. Reconcile stable IDs for brands, locations, kitchens, partners, employees, menus, recipes, inventory, tickets, training, rewards, and orders.
6. Select one repo, one operational database, and one production deployment per approved product surface.
7. Migrate one pilot location and one brand with reconciliation and rollback evidence.
8. Record evidence in Enterprise System Control.

## Brand separation

Each quick-serve brand keeps independent menus, recipes, packaging, training, inventory, financial reporting, marketing, permissions, and QA. Shared locations may be referenced centrally, but brand transactions may not be merged.

## Rollback

Do not delete legacy systems during the pilot. Stop sync jobs, return the pilot to its prior workflow, reconcile by canonical brand/location/order IDs, document variances, and keep the release gate blocked until resolved.
