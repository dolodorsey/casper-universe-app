# CASPER Customer Release Evidence

Updated: 2026-08-09

## Scope

This record applies only to the CASPER Customer / Casper Universe application. CASPER GROUP BOH and all other brands remain separate.

## Completed

- Removed public access to customer profiles and point balances.
- Prevented customers from modifying their own authorization role.
- Removed direct customer inserts into the points ledger.
- Removed public enumeration of QR activation tokens.
- Disabled legacy privileged functions that trusted caller-supplied user IDs, scores, or point values.
- Added authenticated, single-use QR redemption with server-controlled point values, a five-scan daily cap, and duplicate protection.
- Replaced the simulated scanner reward path with the verified Supabase redemption flow.
- Removed optimistic client-side point awards; the customer wallet now reconciles from server-authoritative balances.
- Repaired the rewards wallet, scanner route, shared visual components, theme compatibility, loot types, and root auth routing.
- Applied production migration `secure_customer_rewards_and_profiles` to Supabase project `rvplisxkjsoyfbkyusga`.
- Upgraded the complete application foundation from Expo 52 / React Native 0.76 / React 18 to Expo 57 / React Native 0.86 / React 19, including Router 57, Reanimated 4, Worklets, Async Storage 2, current Supabase JS, and compatible native modules.
- Production dependency audit reports no critical findings. Current Expo/Metro dependencies retain upstream high-severity advisories with no available fix.
- Verified TypeScript compilation and Expo web export across all 12 static routes.
- Expo Doctor passes all 20 compatibility checks.
- Production Hermes bundles export successfully for both iOS (`entry-6760a3388873efce3eb09d2d8abd9708.hbc`) and Android (`entry-e11f292cdabbc58e2ffe7a951528c8e5.hbc`).
- Native identity and release configuration are now explicit: Casper Universe name/slug, branded icon and adaptive icon, `com.caspergroup.universe` bundle/package identity, scanner camera disclosure, and EAS development/preview/store profiles with production auto-increment.
- Stocked production with 12 canonical active brand realms, 12 realm content blocks, a founder mascot set, and a 12-question launch knowledge pack.
- Added a live Supabase-backed Play route and changed the home realm list to prefer the production catalog.
- Added automated backend contract tests and a GitHub quality gate.
- Migrated client configuration toward Supabase publishable keys while retaining temporary legacy anon-key compatibility.

## Verification

```sh
npm run verify
npm audit --omit=dev --audit-level=critical
```

Production verification must confirm unauthenticated routing, OTP sign-in, one successful QR redemption, duplicate rejection, daily-cap rejection, balance refresh, rewards visibility, and sign-out.

## Live platform verification

- Vercel production deployment `dpl_5Su5SBPFM5fEZPQMUdk5M2LxexbJ` is READY at `https://casper-universe-app.vercel.app` and contains commit `3c7327201e782a1c2134e80c7d142c830b5d8ab4`.
- Live browser verification confirms the passwordless email-code entry screen renders and direct anonymous access to `/rewards` redirects to `/auth`.
- Vercel reported no runtime error clusters during the seven-day production check.
- Anonymous callers cannot execute `redeem_qr_token` and have no policy for enumerating `qr_tokens`.
- The authenticated redemption function remains intentionally privileged because it performs the locked, server-authoritative points transaction. It checks `auth.uid()`, locks the token and daily-cap rows, rejects duplicates, enforces five scans per day, and caps each award at 500 points.
- `fraud_log` and `notifications_queue` are intentionally service-only: anonymous and authenticated roles have no DML privileges.
- Remaining platform gates are enabling Supabase leaked-password protection, reviewing the intentional privileged QR redemption function, and updating Expo/Metro after fixes land for their current upstream advisories.
