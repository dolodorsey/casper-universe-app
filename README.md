# CASPER Customer / Casper Universe

Customer loyalty and brand-discovery application for the 12 CASPER brands. This repository is separate from CASPER GROUP BOH.

## Live customer surfaces

- Passwordless email authentication
- Live Supabase realm directory and realm detail screens
- Knowledge quiz backed by the production trivia catalog
- Server-authoritative QR reward redemption on web and mobile
- Rewards wallet, points balance, vault, mascots, and collectible progress

## Production systems

- Expo 57 / React Native 0.86 / React 19
- Supabase Auth, PostgreSQL, row-level security, and protected reward RPCs
- Vercel web deployment
- EAS native build profiles; the Expo project must still be linked before automated store release

## Environment

```sh
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

`EXPO_PUBLIC_SUPABASE_ANON_KEY` remains temporarily supported during the publishable-key migration. Never place a Supabase secret or service-role key in an Expo public variable.

## Install and verify

```sh
npm ci --ignore-scripts
npm run verify
```

The quality gate verifies the backend contract, catalog and reward-integrity tests, TypeScript, Expo web export, and critical dependency findings.

## Database migrations

Migrations live in `supabase/migrations`. The August 9 migrations stock and canonicalize the 12-brand customer catalog. Reward balances and customer history are never seeded for presentation.

## Mobile release policy

Do not deploy iOS manually. Link a valid EAS project, configure non-interactive signing and App Store Connect credentials, then release through automation.

See `RELEASE_EVIDENCE.md` for verified release status.
