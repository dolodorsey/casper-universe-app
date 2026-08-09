-- Remove policies that are fully covered by another policy on the same table.
-- The broader trivia policy exposed inactive questions; retain the active-only rule.
drop policy if exists "Public can view brand_content_blocks" on public.brand_content_blocks;
drop policy if exists qr_redemptions_insert_own on public.qr_redemptions;
drop policy if exists qr_redemptions_select_own on public.qr_redemptions;
drop policy if exists "Public can view trivia_questions" on public.trivia_questions;
