import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LootReward } from '@/lib/rewards';

type GameState = {
  points: number;
  streak: number;
  lastLoot: LootReward[] | null;
  tier: number;

  addPoints: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  setLastLoot: (loot: LootReward[] | null) => void;
  recomputeTier: () => void;
};

function computeTier(points: number) {
  if (points >= 3000) return 4;
  if (points >= 1500) return 3;
  if (points >= 500) return 2;
  return 1;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      points: 0,
      streak: 0,
      lastLoot: null,
      tier: 1,

      addPoints: (pts) =>
        set((state) => {
          const nextPoints = state.points + pts;
          return { points: nextPoints, tier: computeTier(nextPoints) };
        }),

      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
      resetStreak: () => set(() => ({ streak: 0 })),

      setLastLoot: (loot) => set(() => ({ lastLoot: loot })),

      recomputeTier: () => {
        const points = get().points;
        set(() => ({ tier: computeTier(points) }));
      },
    }),
    {
      name: 'casper-universe-game',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        points: state.points,
        streak: state.streak,
        lastLoot: state.lastLoot,
        tier: state.tier,
      }),
    }
  )
);
