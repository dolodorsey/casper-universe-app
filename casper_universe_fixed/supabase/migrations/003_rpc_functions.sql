-- RPC Functions for Casper Universe

-- 1. Award points to a user
CREATE OR REPLACE FUNCTION rpc_award_points(
  p_user_id UUID,
  p_brand_id TEXT,
  p_points INT,
  p_reason TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_new_balance INT;
  v_new_lifetime INT;
BEGIN
  -- Insert into points ledger
  INSERT INTO points_ledger (user_id, brand_id, amount, reason)
  VALUES (p_user_id, p_brand_id, p_points, p_reason);
  
  -- Update user_stats
  UPDATE user_stats
  SET 
    points_balance = points_balance + p_points,
    lifetime_points = lifetime_points + p_points,
    updated_at = NOW()
  WHERE user_id = p_user_id AND brand_id = p_brand_id
  RETURNING points_balance, lifetime_points INTO v_new_balance, v_new_lifetime;
  
  -- If no row was updated, create one
  IF NOT FOUND THEN
    INSERT INTO user_stats (user_id, brand_id, points_balance, lifetime_points, unlocked)
    VALUES (p_user_id, p_brand_id, p_points, p_points, true)
    RETURNING points_balance, lifetime_points INTO v_new_balance, v_new_lifetime;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'new_balance', v_new_balance,
    'lifetime_points', v_new_lifetime
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Complete trivia session
CREATE OR REPLACE FUNCTION rpc_complete_trivia_session(
  p_session_id UUID,
  p_score INT,
  p_total_questions INT
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_brand_id TEXT;
  v_points_earned INT;
BEGIN
  -- Get session details
  SELECT user_id, brand_id INTO v_user_id, v_brand_id
  FROM trivia_sessions
  WHERE id = p_session_id;
  
  -- Calculate points (10 points per correct answer)
  v_points_earned := p_score * 10;
  
  -- Update session
  UPDATE trivia_sessions
  SET 
    score = p_score,
    completed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_session_id;
  
  -- Award points
  PERFORM rpc_award_points(v_user_id, v_brand_id, v_points_earned, 'Trivia completion');
  
  -- Update streak
  UPDATE user_stats
  SET streak_current = streak_current + 1,
      streak_best = GREATEST(streak_best, streak_current + 1),
      last_played_at = NOW()
  WHERE user_id = v_user_id AND brand_id = v_brand_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'points_earned', v_points_earned,
    'score', p_score,
    'total', p_total_questions
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Evaluate unlock rules
CREATE OR REPLACE FUNCTION rpc_evaluate_unlocks(
  p_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_unlocked_brands TEXT[];
  v_rule RECORD;
  v_meets_requirement BOOLEAN;
BEGIN
  v_unlocked_brands := ARRAY[]::TEXT[];
  
  -- Loop through all unlock rules
  FOR v_rule IN SELECT * FROM unlock_rules LOOP
    v_meets_requirement := false;
    
    -- Check if requirement is met
    IF v_rule.requirement_type = 'points' THEN
      SELECT EXISTS(
        SELECT 1 FROM user_stats 
        WHERE user_id = p_user_id 
        AND brand_id = v_rule.requires_brand_id 
        AND lifetime_points >= v_rule.threshold
      ) INTO v_meets_requirement;
    ELSIF v_rule.requirement_type = 'level' THEN
      SELECT EXISTS(
        SELECT 1 FROM user_stats 
        WHERE user_id = p_user_id 
        AND brand_id = v_rule.requires_brand_id 
        AND level >= v_rule.threshold
      ) INTO v_meets_requirement;
    ELSIF v_rule.requirement_type = 'streak' THEN
      SELECT EXISTS(
        SELECT 1 FROM user_stats 
        WHERE user_id = p_user_id 
        AND brand_id = v_rule.requires_brand_id 
        AND streak_best >= v_rule.threshold
      ) INTO v_meets_requirement;
    END IF;
    
    -- Unlock brand if requirement is met
    IF v_meets_requirement THEN
      UPDATE user_stats
      SET unlocked = true
      WHERE user_id = p_user_id AND brand_id = v_rule.unlocks_brand_id;
      
      v_unlocked_brands := array_append(v_unlocked_brands, v_rule.unlocks_brand_id);
    END IF;
  END LOOP;
  
  RETURN jsonb_build_object(
    'success', true,
    'newly_unlocked', v_unlocked_brands
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Scan QR code
CREATE OR REPLACE FUNCTION rpc_scan_qr(
  p_user_id UUID,
  p_qr_code_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_qr RECORD;
  v_already_scanned BOOLEAN;
BEGIN
  -- Get QR code details
  SELECT * INTO v_qr FROM qr_codes WHERE id = p_qr_code_id;
  
  -- Check if already scanned
  SELECT EXISTS(
    SELECT 1 FROM qr_scans 
    WHERE user_id = p_user_id AND qr_code_id = p_qr_code_id
  ) INTO v_already_scanned;
  
  IF v_already_scanned THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'QR code already scanned'
    );
  END IF;
  
  -- Record scan
  INSERT INTO qr_scans (user_id, qr_code_id, scanned_at)
  VALUES (p_user_id, p_qr_code_id, NOW());
  
  -- Award points
  PERFORM rpc_award_points(p_user_id, v_qr.brand_id, v_qr.points_reward, 'QR scan');
  
  RETURN jsonb_build_object(
    'success', true,
    'points_earned', v_qr.points_reward,
    'brand_id', v_qr.brand_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
