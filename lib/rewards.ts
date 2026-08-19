import { supabase, isSupabaseConfigured } from './supabase';

export type Reward = {
  id: string;
  brandId: string | null;
  name: string;
  description: string;
  pointsRequired: number;
  inventoryLimit: number | null;
  usedCount: number;
  remainingInventory: number | null;
  inventoryAvailable: boolean;
  termsFreshness: 'current' | 'stale';
  imageUrl: string | null;
};

export type LootReward =
  | { type: 'points'; amount: number; label: string }
  | { type: 'perk'; perkId: string; label: string };

type RewardRow = {
  id: string;
  brand_id: string | null;
  title: string;
  description: string | null;
  cost_points: number;
  inventory_limit: number | null;
  used_count: number;
  remaining_inventory: number | null;
  inventory_available: boolean;
  terms_freshness: 'current' | 'stale';
  image_url: string | null;
  publishable_now: boolean;
};

/**
 * Customer rewards fail closed. Static copy, an active flag, or a marketing
 * concept cannot create a benefit. Current terms, positive cost and remaining
 * inventory are all required by the database intelligence view.
 */
export async function loadPublishableRewards(brandId?: string): Promise<Reward[]> {
  if (!isSupabaseConfigured) return [];
  let query = supabase
    .from('casper_rewards_intelligence')
    .select('id,brand_id,title,description,cost_points,inventory_limit,used_count,remaining_inventory,inventory_available,terms_freshness,image_url,publishable_now')
    .eq('publishable_now', true)
    .order('cost_points', { ascending: true });
  if (brandId) query = query.eq('brand_id', brandId);
  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as RewardRow[]).map((row) => ({
    id: row.id,
    brandId: row.brand_id,
    name: row.title,
    description: row.description ?? '',
    pointsRequired: row.cost_points,
    inventoryLimit: row.inventory_limit,
    usedCount: row.used_count,
    remainingInventory: row.remaining_inventory,
    inventoryAvailable: row.inventory_available,
    termsFreshness: row.terms_freshness,
    imageUrl: row.image_url,
  }));
}

// Deprecated synchronous exports intentionally contain no invented customer
// benefits. Call loadPublishableRewards() for current claimable rewards.
export const REWARDS: Reward[] = [];
export const perks = REWARDS;
