import { create } from "zustand";
import { LootReward } from "@/lib/rewards";

type GameState = {
  points: number;
  streak: number;
  lastPlayed: string | null;
  addPoints: (pts: number) => void;
  
  // Phase 3: Loot + Perks
  lastLoot: LootReward | null;
  setLastLoot: (r: LootReward | null) => void;
  unlockedPerks: string[];
  unlockPerk: (perkId: string) => void;
};

export const useGameStore = create<GameState>()((set, get) => ({
  points: 0,
  streak: 0,
  lastPlayed: null,
  addPoints: (pts) => set((state) => ({ points: state.points + pts })),
  
  // Phase 3: Loot + Perks
  lastLoot: null,
  setLastLoot: (r) => set({ lastLoot: r }),
  
  unlockedPerks: [],
  unlockPerk: (perkId) =>
    set((state) => ({
      unlockedPerks: state.unlockedPerks.includes(perkId)
        ? state.unlockedPerks
        : [...state.unlockedPerks, perkId]
    }))
}));
