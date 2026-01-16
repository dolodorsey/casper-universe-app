# Casper Universe App

> Gamified brand universe with trivia, mascots, rewards, and QR scans for 10 Casper brands

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- Supabase account

### Setup

```bash
# Clone repo
git clone https://github.com/dolodorsey/casper-universe-app.git
cd casper-universe-app

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your Supabase URL and anon key

# Start app
npx expo start
```

## 📊 Database Setup

### 1. Run Migrations in Supabase SQL Editor

Execute in order:
1. `supabase/migrations/001_init.sql` - Creates all tables
2. `supabase/migrations/002_rls_policies.sql` - Security policies
3. `supabase/migrations/003_rpc_functions.sql` - Core RPCs
4. `supabase/migrations/004_seed.sql` - 10 brands + content

### 2. Tables Created (18 total)

**Core Identity**
- `profiles` - User profiles
- `user_stats` - Points, streaks, levels

**Brands & Content**
- `brands` - 10 Casper brands
- `brand_content_blocks` - Dynamic realm layout

**Gamification**
- `mascots` + `user_mascots` - Collectible characters
- `badges` + `user_badges` - Achievements
- `unlock_rules` - Flexible unlock engine
- `points_ledger` - All point transactions

**Trivia**
- `trivia_packs` + `trivia_questions`
- `trivia_sessions` + `trivia_session_answers`

**Rewards**
- `rewards_catalog` + `reward_redemptions`
- `drops` + `user_drops` - Limited-time collectibles

**QR Scavenger**
- `qr_codes` + `qr_scans`

## 🎮 10 Casper Brands

1. **Angel Wings** - Premium chicken wings
2. **Pasta Bish** - Artisan pasta
3. **Taco Yaki** - Fusion tacos
4. **Patty Daddy** - Gourmet burgers
5. **Espresso Co** - Specialty coffee
6. **Morning After** - Breakfast & brunch
7. **Tossd** - Fresh salads
8. **Sweet Tooth** - Desserts
9. **Mojo Juice** - Cold-pressed juice
10. **Mr Oyster** - Seafood

## 🗂️ Project Structure

```
casper-universe-app/
├── app/                    # Expo Router screens
│   ├── (auth)/
│   │   ├── sign-in.tsx
│   │   └── verify.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── universe.tsx    # Home dashboard
│   │   ├── brands.tsx      # Brand directory
│   │   ├── play.tsx        # Trivia hub
│   │   ├── rewards.tsx     # Vault + drops
│   │   └── profile.tsx     # Mascots & badges
│   ├── brands/
│   │   └── [brandId].tsx   # Brand realm
│   ├── trivia/
│   │   ├── session.tsx
│   │   └── results.tsx
│   ├── rewards/
│   │   ├── drop/[dropId].tsx
│   │   └── redeem/[rewardId].tsx
│   ├── mascot/
│   │   └── [mascotId].tsx
│   └── qr/
│       └── scan.tsx
├── src/
│   ├── core/
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   └── constants.ts
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── types.ts
│   │   ├── auth/
│   │   │   └── session.ts
│   │   └── analytics/
│   │       └── events.ts
│   ├── design-system/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── motion.ts
│   ├── ui/
│   │   ├── primitives/     # Button, Text, Icon
│   │   ├── layout/         # Screen, Card, Sheet
│   │   └── data/           # MetricTile, ProgressBar
│   ├── features/
│   │   ├── universe/
│   │   ├── brands/
│   │   ├── mascots/
│   │   ├── trivia/
│   │   ├── rewards/
│   │   └── profile/
│   └── lib/
│       ├── gamification/   # Points, streaks, unlocks
│       └── media/          # Lottie, Rive helpers
└── supabase/
    └── migrations/
        ├── 001_init.sql
        ├── 002_rls_policies.sql
        ├── 003_rpc_functions.sql
        └── 004_seed.sql
```

## 🔐 Security (RLS)

**Public Read:**
- brands, mascots, trivia_packs, trivia_questions, rewards_catalog, drops, badges

**User-Scoped:**
- profiles, user_stats, user_mascots, trivia_sessions, points_ledger, reward_redemptions, user_badges, user_drops, qr_scans

All user data protected with `auth.uid() = user_id` policies.

## ⚙️ Core RPC Functions

1. **rpc_award_points(event_type, delta, meta)**
   - Inserts points_ledger row
   - Updates user_stats (balance, lifetime, xp, level)

2. **rpc_complete_trivia_session(session_id)**
   - Calculates score/correct/total
   - Awards points
   - Updates streaks
   - Triggers unlock evaluation

3. **rpc_evaluate_unlocks(user_id)**
   - Checks all unlock_rules.rule_json
   - Grants mascots/badges/drops/rewards

4. **rpc_scan_qr(code)**
   - Validates QR code
   - Prevents duplicates
   - Awards points
   - Triggers unlocks

## 🎯 Unlock Rules Engine

Flexible JSON-based rules:

```json
{
  "all": [
    { "event": "TRIVIA_SESSION_COMPLETED", "count": 3, "where": { "brand_id": "taco-yaki" } }
  ]
}
```

```json
{
  "all": [
    { "metric": "streak_current", "gte": 5 }
  ]
}
```

## 📱 Features by Week

### Week 1: Foundation
- ✅ Expo Router tabs
- ✅ Supabase auth
- ✅ Design system
- ✅ Brands directory

### Week 2: Mascots + Trivia
- Mascot collection UI
- Trivia packs + session runner
- Points + streak tracking

### Week 3: Rewards + Drops
- Rewards vault
- Drop countdowns
- Redemption flow
- Push notifications

### Week 4: QR + Unlocks
- QR scanner
- Unlock animations
- Profile inventory

## 🔗 Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=https://rvplisxkjsoyfbkyusga.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 📦 Key Dependencies

```json
{
  "@supabase/supabase-js": "^2.x",
  "@react-native-async-storage/async-storage": "^1.x",
  "expo-router": "^3.x",
  "expo-camera": "^14.x",
  "react-native-url-polyfill": "^2.x"
}
```

## 🚧 Development Status

- [x] Database schema
- [x] RLS policies
- [x] RPC functions
- [x] Seed data (10 brands)
- [ ] Expo app scaffolding
- [ ] Auth flow
- [ ] Feature implementations
- [ ] Push notifications
- [ ] QR scanning

## 📄 License

MIT
