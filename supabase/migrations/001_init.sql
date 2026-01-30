-- Casper Universe Database Schema
-- Migration 001: Initial Schema

-- A) Core Identity + Profile
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  home_city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  points_balance INT DEFAULT 0,
  lifetime_points INT DEFAULT 0,
  streak_current INT DEFAULT 0,
  streak_best INT DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- B) Brand Worlds
CREATE TABLE brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  realm_bg_url TEXT,
  realm_audio_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0
);

CREATE TABLE brand_content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id TEXT REFERENCES brands(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT,
  body TEXT,
  media_url TEXT,
  cta_label TEXT,
  cta_action TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- C) Unlock Rules Engine
CREATE TABLE unlock_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  rule_json JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- D) Mascots + Collection
CREATE TABLE mascots (
  id TEXT PRIMARY KEY,
  brand_id TEXT REFERENCES brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT,
  rarity TEXT,
  default_image_url TEXT,
  animation_url TEXT,
  celebrate_animation_url TEXT,
  unlock_rule_id UUID REFERENCES unlock_rules(id),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_mascots (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mascot_id TEXT REFERENCES mascots(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  xp INT DEFAULT 0,
  level INT DEFAULT 1,
  is_favorite BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id, mascot_id)
);

-- E) Trivia System
CREATE TABLE trivia_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id TEXT REFERENCES brands(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT,
  tags TEXT[] DEFAULT '{}',
  is_daily BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE trivia_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id UUID REFERENCES trivia_packs(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  type TEXT NOT NULL,
  choices JSONB NOT NULL,
  answer_index INT NOT NULL,
  explanation TEXT,
  points_awarded INT DEFAULT 10,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE trivia_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  brand_id TEXT REFERENCES brands(id) ON DELETE SET NULL,
  pack_id UUID REFERENCES trivia_packs(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  score INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  total_count INT DEFAULT 0,
  points_earned INT DEFAULT 0
);

CREATE TABLE trivia_session_answers (
  session_id UUID REFERENCES trivia_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES trivia_questions(id) ON DELETE CASCADE,
  selected_index INT,
  is_correct BOOLEAN,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (session_id, question_id)
);

-- F) Points Ledger + Badges
CREATE TABLE points_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  delta INT NOT NULL,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  unlock_rule_id UUID REFERENCES unlock_rules(id),
  rarity TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_badges (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT REFERENCES badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- G) Rewards + Drops
CREATE TABLE rewards_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id TEXT REFERENCES brands(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  cost_points INT NOT NULL,
  inventory_limit INT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES rewards_catalog(id),
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT,
  code TEXT,
  meta JSONB
);

CREATE TABLE drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id TEXT REFERENCES brands(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  drop_type TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  image_url TEXT,
  unlock_rule_id UUID REFERENCES unlock_rules(id),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_drops (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  drop_id UUID REFERENCES drops(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, drop_id)
);

-- H) QR Codes
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  brand_id TEXT REFERENCES brands(id) ON DELETE SET NULL,
  campaign TEXT,
  points_award INT DEFAULT 25,
  unlock_rule_id UUID REFERENCES unlock_rules(id),
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ
);

CREATE TABLE qr_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  qr_code_id UUID REFERENCES qr_codes(id) ON DELETE CASCADE,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  meta JSONB
);

-- Create unique index to prevent duplicate QR scans
CREATE UNIQUE INDEX qr_scans_user_code_unique ON qr_scans (user_id, qr_code_id);
