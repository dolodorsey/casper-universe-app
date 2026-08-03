# CASPER Customer Release Evidence

Updated: 2026-08-03

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
- Reduced dependency findings from 31, including two critical findings, to 14 moderate transitive Expo findings with no critical or high findings.
- Verified TypeScript compilation and Expo web export across all 12 static routes.

## Verification

```sh
npm run verify
npm audit --omit=dev --audit-level=critical
```

Production verification must confirm unauthenticated routing, OTP sign-in, one successful QR redemption, duplicate rejection, daily-cap rejection, balance refresh, rewards visibility, and sign-out.

## Live platform verification

- Latest Vercel production deployment is ready and matches commit `bef6fe4`.
- Vercel reported no runtime error clusters during the seven-day production check.
- Anonymous callers cannot execute `redeem_qr_token` and have no policy for enumerating `qr_tokens`.
- The authenticated redemption function remains intentionally privileged because it performs the locked, server-authoritative points transaction. It checks `auth.uid()`, locks the token and daily-cap rows, rejects duplicates, enforces five scans per day, and caps each award at 500 points.
- `fraud_log` and `notifications_queue` are intentionally service-only: anonymous and authenticated roles have no DML privileges.
- The remaining actionable dashboard gate is enabling Supabase leaked-password protection.
