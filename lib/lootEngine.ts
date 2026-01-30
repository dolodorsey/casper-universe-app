import { LootReward, perks } from "@/lib/rewards";

export function generateLoot(pointsBase = 75): LootReward {
  // 70% points, 30% perk
  const roll = Math.random();

  if (roll < 0.7) {
    const amount = pointsBase + Math.floor(Math.random() * 90);
    return { type: "points", amount, label: `+${amount} Power Points` };
  }

  const perk = perks[Math.floor(Math.random() * perks.length)];
  return {
    type: "perk",
    perkId: perk.id,
    label: `Unlocked Perk: ${perk.title}`
  };
}
