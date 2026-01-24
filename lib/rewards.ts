export type LootReward =
  | { type: "points"; amount: number; label: string }
  | { type: "perk"; perkId: string; label: string };

export const perks = [
  { id: "vip-sauce", title: "VIP Sauce Drop", tier: "Icon" },
  { id: "double-shot", title: "Double Shot Multiplier", tier: "Rookie" },
  { id: "priority-line", title: "Priority Access", tier: "Legend" }
];
