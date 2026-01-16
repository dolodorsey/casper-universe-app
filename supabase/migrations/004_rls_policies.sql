-- RLS Policies for Casper Universe

-- Enable RLS on user-scoped tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE trivia_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trivia_session_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE drops ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User Stats: users can read/update their own stats
CREATE POLICY "Users can view own stats" ON user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Badges: users can read their own badges
CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);

-- Points Ledger: users can read their own points history
CREATE POLICY "Users can view own points" ON points_ledger FOR SELECT USING (auth.uid() = user_id);

-- QR Scans: users can read their own scans
CREATE POLICY "Users can view own scans" ON qr_scans FOR SELECT USING (auth.uid() = user_id);

-- Trivia Sessions: users can read/update their own sessions
CREATE POLICY "Users can view own sessions" ON trivia_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON trivia_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON trivia_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trivia Answers: users can read/insert their own answers
CREATE POLICY "Users can view own answers" ON trivia_session_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM trivia_sessions WHERE id = session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own answers" ON trivia_session_answers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM trivia_sessions WHERE id = session_id AND user_id = auth.uid())
);

-- Reward Redemptions: users can read their own redemptions
CREATE POLICY "Users can view own redemptions" ON reward_redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own redemptions" ON reward_redemptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Drops: users can read drops for unlocked brands or public drops
CREATE POLICY "Users can view drops for unlocked brands" ON drops FOR SELECT USING (
  is_public = true OR brand_id IN (
    SELECT brand_id FROM user_stats WHERE user_id = auth.uid() AND unlocked = true
  )
);

-- Public read-only tables (no RLS needed, already public)
-- brands, mascots, badges, unlock_rules, trivia_packs, trivia_questions, rewards_catalog, qr_codes, brand_content_blocks
