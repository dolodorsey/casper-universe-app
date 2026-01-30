export type LootReward =
  | { type: 'points'; amount: number; label: string }
  | { type: 'perk'; perkId: string; label: string };

export type RewardRarity = 'common' | 'epic' | 'legendary';

export type Reward = {
  id: string;
  icon: string;
  name: string;
  description: string;
  pointsRequired: number;
  tierRequired: number;
  rarity: RewardRarity;
};

// Perks are also used by the loot engine.
export const perks = [
  { id: 'vip-sauce', title: 'VIP Sauce Drop', tier: 2 },
  { id: 'double-shot', title: 'Double Shot Multiplier', tier: 1 },
  { id: 'priority-line', title: 'Priority Access', tier: 3 }
] as const;

// App rewards catalog (Phase 2+3 can replace this with Supabase-backed rewards)
export const REWARDS: Reward[] = [
  {
    id: 'r-01',
    icon: '🥤',
    name: 'Free Espresso Shot',
    description: 'One free shot at Espresso Co.',
    pointsRequired: 250,
    tierRequired: 1,
    rarity: 'common'
  },
  {
    id: 'r-02',
    icon: '🌮',
    name: 'Taco Yaki Combo Upgrade',
    description: 'Upgrade any combo once.',
    pointsRequired: 500,
    tierRequired: 1,
    rarity: 'common'
  },
  {
    id: 'r-03',
    icon: '🍔',
    name: 'Paddy’s Secret Sauce Sample',
    description: 'Limited sample drop (in-store).',
    pointsRequired: 900,
    tierRequired: 2,
    rarity: 'epic'
  },
  {
    id: 'r-04',
    icon: '⭐️',
    name: 'Priority Line Pass',
    description: 'Skip the line at participating locations.',
    pointsRequired: 1500,
    tierRequired: 3,
    rarity: 'legendary'
  }
];
