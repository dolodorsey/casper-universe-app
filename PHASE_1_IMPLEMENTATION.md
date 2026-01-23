# Phase 1: Visual Domination - Complete Implementation Guide

## Status: Dependencies Added ✅ | Theme Created ✅ | Components Pending

---

## Quick Start

Run this in your project root:

```bash
cd casper-universe-app
npm install
```

Then create the files below.

---

## File 1: `data/episodes.ts`

```typescript
export type Episode = {
  id: string;
  brandSlug: string;
  title: string;
  hook: string;
  narrative: string;
  rewardLabel: string;
  rewardPoints: number;
  accent: string;
};

export const episodes: Episode[] = [
  {
    id: "ep-beanzo-01",
    brandSlug: "espresso-co",
    title: "Episode 01 — The Espresso Protocol",
    hook: "Beanzo just launched a formula that deletes sleep.",
    narrative: "The city's moving faster than human. Beanzo's lab is open. The shots hit like rocket fuel. Your mission: prove you can handle the power… without folding.",
    rewardLabel: "Double Shot Bonus",
    rewardPoints: 120,
    accent: "#3B82F6"
  },
  {
    id: "ep-yaki-01",
    brandSlug: "taco-yaki",
    title: "Episode 01 — Fire Discipline",
    hook: "Yaki started a new combat kitchen tournament.",
    narrative: "Wok flames. Taco crunch. Hibachi heat. Every plate is a fight. Your mission: survive the combo and unlock the sauce tier.",
    rewardLabel: "Combo Fury Bonus",
    rewardPoints: 150,
    accent: "#EF4444"
  },
  {
    id: "ep-paddy-01",
    brandSlug: "patty-daddy",
    title: "Episode 01 — The Sauce Code",
    hook: "Paddy's Secret Sauce got leaked… allegedly.",
    narrative: "The streets want the formula. Paddy Daddy wants loyalty. Your mission: earn the right to taste what other people can't even pronounce.",
    rewardLabel: "VIP Sauce Unlock",
    rewardPoints: 175,
    accent: "#D7B46A"
  }
];
```

---

## File 2: `data/brands.ts`

Create this if it doesn't exist:

```typescript
export type Brand = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  vibe: string;
  primary: string;
};

export const brands: Brand[] = [
  {
    id: "1",
    slug: "espresso-co",
    name: "Espresso Co",
    tagline: "Rocket fuel in a cup",
    vibe: "Speed + Focus",
    primary: "#3B82F6"
  },
  {
    id: "2",
    slug: "taco-yaki",
    name: "Taco Yaki",
    tagline: "Combat kitchen fusion",
    vibe: "Fire + Crunch",
    primary: "#EF4444"
  },
  {
    id: "3",
    slug: "patty-daddy",
    name: "Patty Daddy",
    tagline: "Secret sauce authority",
    vibe: "Power + Flavor",
    primary: "#D7B46A"
  },
  {
    id: "4",
    slug: "angel-wings",
    name: "Angel Wings",
    tagline: "Premium wing perfection",
    vibe: "Crispy + Divine",
    primary: "#F97316"
  },
  {
    id: "5",
    slug: "pasta-bish",
    name: "Pasta Bish",
    tagline: "Artisan pasta mastery",
    vibe: "Fresh + Authentic",
    primary: "#34C759"
  }
];
```

---

## File 3: `data/mascots.ts`

```typescript
export type Mascot = {
  id: string;
  brandSlug: string;
  name: string;
  oneLiner: string;
  quote: string;
};

export const mascots: Mascot[] = [
  {
    id: "m1",
    brandSlug: "espresso-co",
    name: "Beanzo",
    oneLiner: "Enter the chaos.",
    quote: "Sleep is for the weak. Espresso is forever."
  },
  {
    id: "m2",
    brandSlug: "taco-yaki",
    name: "Yaki",
    oneLiner: "Taste the fire.",
    quote: "In my kitchen, every plate is a knockout."
  },
  {
    id: "m3",
    brandSlug: "patty-daddy",
    name: "Paddy",
    oneLiner: "Respect the sauce.",
    quote: "The formula stays with me. Earn it."
  }
];
```

---

## File 4: `components/CinematicBackground.tsx`

See original instructions for full code.

## File 5: `components/NeonGlass.tsx`

See original instructions for full code.

## File 6: `components/UniverseHUDPro.tsx`

See original instructions for full code.

## File 7: `components/WorldPortalCard.tsx`

See original instructions for full code.

## File 8: `components/PrimaryButton.tsx`

```typescript
import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { theme } from "@/lib/theme";

type Tone = "gold" | "blue" | "green";

export function PrimaryButton({
  title,
  onPress,
  tone = "gold"
}: {
  title: string;
  onPress: () => void;
  tone?: Tone;
}) {
  const bg = tone === "gold" ? theme.gold : tone === "blue" ? theme.blue : theme.green;

  return (
    <Pressable
      onPress={async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: theme.radius.lg,
    alignItems: "center"
  },
  text: {
    color: "#000",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1
  }
});
```

## File 9: `store/useAppStore.ts`

```typescript
import { create } from "zustand";

type Profile = {
  id: string;
  points: number;
  tier: string;
  streak: number;
};

type AppStore = {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile })
}));
```

---

## File 10: `app/(tabs)/universe.tsx`

See original instructions - this is the MASTERPIECE lobby screen that brings everything together.

---

## Final Steps

1. Copy all code from original instructions
2. Create each file in your editor
3. Run `npx expo start`
4. Open on device
5. Witness the premium transformation ✨

All dependencies are installed. Theme is ready. Just add the components and data!
