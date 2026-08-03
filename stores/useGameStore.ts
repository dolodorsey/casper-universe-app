import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LootReward } from '@/lib/rewards';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Casper Universe — Game state store.
 *
 * Local-first: state lives in AsyncStorage so the app works offline.
 * On sync we pull authoritative server values from user_stats; server wins.
 * On addPoints we write to points_ledger and rely on server-side trigger
 * to update user_stats, then re-pull to reconcile.
 */

type GameState = {
  // Identity
  userId: string | null;
  setUserId: (id: string | null) => void;

  // Core gameplay
  points: number;
  streak: number;
  lastPlayed: string | null;

  // Phase 3
  lastLoot: LootReward | null;
  unlockedPerks: string[];

  // Hydration / sync
  isHydrated: boolean;
  isSyncing: boolean;

  // Actions
  addPoints: (pts: number, source?: string) => Promise<void>;
  setLastLoot: (r: LootReward | null) => void;
  unlockPerk: (perkId: string) => void;
  syncFromServer: () => Promise<void>;
  reset: () => void;
};

const INITIAL = {
  userId: null,
  points: 0,
  streak: 0,
  lastPlayed: null,
  lastLoot: null,
  unlockedPerks: [],
  isHydrated: false,
  isSyncing: false,
} as const;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...INITIAL,
      unlockedPerks: [...INITIAL.unlockedPerks],

      setUserId: (id) => set({ userId: id }),

      addPoints: async (pts, source = 'unknown') => {
        void pts;
        console.warn(`[GameStore] Ignored unverified client point event: ${source}`);
        await get().syncFromServer();
      },

      setLastLoot: (r) => set({ lastLoot: r }),

      unlockPerk: (perkId) =>
        set((state) => ({
          unlockedPerks: state.unlockedPerks.includes(perkId)
            ? state.unlockedPerks
            : [...state.unlockedPerks, perkId],
        })),

      syncFromServer: async () => {
        const userId = get().userId;
        if (!isSupabaseConfigured || !userId) {
          set({ isHydrated: true });
          return;
        }
        set({ isSyncing: true });
        try {
          const { data, error } = await supabase
            .from('user_stats')
            .select('points_balance, streak_current, last_played_at')
            .eq('user_id', userId);
          if (!error && Array.isArray(data) && data.length > 0) {
            const totals = data.reduce(
              (acc: { p: number; s: number; t: string | null }, row: any) => ({
                p: acc.p + (row.points_balance ?? 0),
                s: Math.max(acc.s, row.streak_current ?? 0),
                t:
                  row.last_played_at && (!acc.t || row.last_played_at > acc.t)
                    ? row.last_played_at
                    : acc.t,
              }),
              { p: 0, s: 0, t: null as string | null },
            );
            set({
              points: totals.p,
              streak: totals.s,
              lastPlayed: totals.t,
            });
          }
        } catch (err) {
          console.warn('[GameStore] syncFromServer failed:', err);
        } finally {
          set({ isSyncing: false, isHydrated: true });
        }
      },

      reset: () => set({ ...INITIAL, unlockedPerks: [] }),
    }),
    {
      name: 'casper-universe-game-state',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userId: state.userId,
        points: state.points,
        streak: state.streak,
        lastPlayed: state.lastPlayed,
        lastLoot: state.lastLoot,
        unlockedPerks: state.unlockedPerks,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) (state as any).isHydrated = true;
      },
    },
  ),
);
