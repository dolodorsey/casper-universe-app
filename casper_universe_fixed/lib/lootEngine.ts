import { LootReward, perks } from '@/lib/rewards';

function tierToPointsBase(tier: number) {
  if (tier >= 3) return 180;
  if (tier >= 2) return 120;
  return 75;
}

// Single reward (internal helper)
export function generateLoot(pointsBase = 75): LootReward {
  const roll = Math.random();
  if (roll < 0.7) {
    const amount = pointsBase + Math.floor(Math.random() * 90);
    return { type: 'points', amount, label: `+${amount} Power Points` };
  }

  const perk = perks[Math.floor(Math.random() * perks.length)];
  return {
    type: 'perk',
    perkId: perk.id,
    label: `Unlocked Perk: ${perk.title}`,
  };
}

// Public: loot drop returns 1–3 rewards
export function generateLootDrop(tier: number): LootReward[] {
  const pointsBase = tierToPointsBase(tier);
  const count = Math.random() < 0.2 ? 3 : Math.random() < 0.6 ? 2 : 1;
  return Array.from({ length: count }).map(() => generateLoot(pointsBase));
}
