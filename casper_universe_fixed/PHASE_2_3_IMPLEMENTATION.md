# Phase 2 + 3 Implementation Guide

## ✅ Completed Files (All Created)

### Phase 2 - Motion Components
- `components/AnimatedIn.tsx` - Stagger-in animations
- `components/GlowPulse.tsx` - Portal pulse glow
- `components/ui/PrimaryButton.tsx` - Button component
- `components/LootChestModal.tsx` - Loot reveal modal

### Phase 3 - Loot System
- `lib/rewards.ts` - Loot types & perks catalog
- `lib/lootEngine.ts` - Loot generation logic
- `stores/useGameStore.ts` - Extended with loot/perks state

---

## 🔧 Integration Steps

### 1. Wire AnimatedIn into Universe Screen

**File:** `app/(tabs)/universe.tsx` or your main lobby screen

```tsx
import { AnimatedIn } from "@/components/AnimatedIn";

// Wrap your main sections:
export default function UniverseScreen() {
  return (
    <Screen>
      <AnimatedIn delay={80}>
        {/* Hero/Header Section */}
      </AnimatedIn>

      <AnimatedIn delay={180}>
        {/* Featured Episode/Content */}
      </AnimatedIn>

      <AnimatedIn delay={260}>
        {/* Portals Grid */}
      </AnimatedIn>

      <AnimatedIn delay={340}>
        {/* Rewards Preview */}
      </AnimatedIn>
    </Screen>
  );
}
```

---

### 2. Add GlowPulse to Portal Cards

**Find your portal card component** (likely in `components/` or `src/features/universe/`)

```tsx
import { GlowPulse } from "@/components/GlowPulse";
import { theme } from "@/lib/theme";

export function WorldPortalCard({ brand, onPress }: Props) {
  const accent = brand?.accentColor ?? theme.brandAccent;

  return (
    <Pressable onPress={onPress} style={{ borderRadius: 24, overflow: "hidden" }}>
      <View style={{ position: "relative", padding: 16 }}>
        <GlowPulse accent={accent} />
        
        {/* Existing card content */}
      </View>
    </Pressable>
  );
}
```

---

### 3. Add Streak Multiplier to Trivia

**File:** `app/trivia/session.tsx` (or wherever trivia questions are answered)

```tsx
import { useGameStore } from "@/stores/useGameStore";

const streak = useGameStore((s) => s.streak);
const addPoints = useGameStore((s) => s.addPoints);

function handleCorrectAnswer(currentQuestion: { reward: number }) {
  // Apply streak bonus (caps at 3x)
  const streakBonus = Math.min(3, 1 + streak * 0.1);
  const total = Math.round(currentQuestion.reward * streakBonus);
  
  addPoints(total);
  // Also send to your Supabase RPC if you have one
}
```

---

### 4. Integrate Loot Chest into QR Scan

**File:** `app/qr/scan.tsx` or your QR scanner screen

```tsx
import { generateLoot } from "@/lib/lootEngine";
import { LootChestModal } from "@/components/LootChestModal";
import { useGameStore } from "@/stores/useGameStore";
import * as Haptics from "expo-haptics";

export default function QRScanScreen() {
  const addPoints = useGameStore((s) => s.addPoints);
  const unlockPerk = useGameStore((s) => s.unlockPerk);
  const lastLoot = useGameStore((s) => s.lastLoot);
  const setLastLoot = useGameStore((s) => s.setLastLoot);

  async function handleScanSuccess(code: string) {
    // Your existing Supabase validation
    // await supabase.rpc("rpc_scan_qr", { code });

    // Generate loot
    const loot = generateLoot(90); // 90 base points
    setLastLoot(loot);

    if (loot.type === "points") {
      addPoints(loot.amount);
    }
    if (loot.type === "perk") {
      unlockPerk(loot.perkId);
    }

    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );
  }

  return (
    <>
      {/* Your scanner UI */}
      
      <LootChestModal
        open={!!lastLoot}
        reward={lastLoot}
        onClose={() => setLastLoot(null)}
      />
    </>
  );
}
```

---

### 5. Update Rewards Screen with Tier System

**File:** `app/(tabs)/rewards.tsx`

```tsx
import { perks } from "@/lib/rewards";
import { useGameStore } from "@/stores/useGameStore";
import { theme } from "@/lib/theme";

export default function RewardsScreen() {
  const unlockedPerks = useGameStore((s) => s.unlockedPerks);

  return (
    <Screen>
      {/* Your existing vault content */}

      <Text style={{ fontSize: 18, fontWeight: "900", marginTop: 20 }}>
        Perks
      </Text>

      {perks.map((perk) => {
        const unlocked = unlockedPerks.includes(perk.id);

        return (
          <View
            key={perk.id}
            style={{
              marginTop: 12,
              padding: 16,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: unlocked
                ? "rgba(255,215,0,0.6)"
                : "rgba(255,255,255,0.14)",
              backgroundColor: "rgba(8,8,16,0.9)"
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "900", fontSize: 16 }}>
              {perk.title}
            </Text>

            <Text
              style={{
                marginTop: 6,
                color: unlocked ? theme.success : theme.muted
              }}
            >
              {unlocked
                ? `ACTIVE • ${perk.tier.toUpperCase()} tier`
                : `Reach ${perk.tier.toUpperCase()} tier to unlock`}
            </Text>
          </View>
        );
      })}
    </Screen>
  );
}
```

---

## 🎯 What This Achieves

### Phase 2 - "Feels Expensive" Motion
✅ Sections slide in with staggered timing (premium entrance)
✅ Portal cards pulse with subtle glow ("alive" UI)
✅ Smooth spring animations on modals

### Phase 3 - Real Gameplay Loop
✅ QR scans → Loot chests (70% points, 30% perks)
✅ Trivia → Streak multiplier (up to 3x)
✅ Rewards wallet → Shows locked/unlocked perks with tier requirements
✅ Global state → Tracks loot drops and perk unlocks

---

## 🚀 Quick Start

1. **Run the app:** `npm start`
2. **Test motion:** Open universe screen, watch staggered animations
3. **Test loot:** Scan a QR code, see loot chest modal
4. **Test rewards:** Open rewards tab, see locked vs unlocked perks
5. **Test streak:** Play trivia, earn bonus points based on streak

---

## 📝 Notes

- All motion components use `react-native-reanimated` (already in dependencies)
- Loot system is self-contained in `lib/` folder
- Game store uses Zustand (already in dependencies)
- Haptics work on physical devices only (simulator won't vibrate)

---

## ✨ Next Steps (Optional Enhancements)

- Add more perks to `lib/rewards.ts`
- Adjust loot drop rates in `lib/lootEngine.ts` (currently 70/30 split)
- Connect perks to actual benefits (e.g., point multipliers)
- Add tier progression UI to show progress toward next tier
- Persist unlocked perks to Supabase (currently local state only)

---

**All core files are created and committed. Just wire them into your existing screens using the code above!**
