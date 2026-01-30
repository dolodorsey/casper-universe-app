import React from 'react';
import { View, Text } from 'react-native';
import Screen from '@/components/ui/Screen';
import GlassCard from '@/components/ui/GlassCard';
import RealmPortalHero from '@/components/home/RealmPortalHero';
import RealmCarousel from '@/components/home/RealmCarousel';
import { type } from '@/lib/ui/type';
import { tokens } from '@/lib/ui/tokens';
import { REALMS } from '@/data/realms';
import { useGameStore } from '@/stores/useGameStore';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { points, tier } = useGameStore();
  const current = REALMS[0]; // Logic to get current realm can be added here later

  return (
    <Screen>
      <RealmPortalHero realmName={current.name} accent={current.accent} points={points} tier={tier} />

      <RealmCarousel onEnter={(id) => router.push(`/realms/${id}` as any)} />

      <GlassCard>
        <Text style={type.h2}>Today’s Drops</Text>
        <Text style={type.caption}>Claim a crate daily. Limited.</Text>
        <Text style={[type.mono, { marginTop: tokens.spacing.sm }]}>NEXT: Daily Drop button</Text>
      </GlassCard>

      <GlassCard>
        <Text style={type.h2}>Today’s Quests</Text>
        <Text style={type.caption}>Three quests max. Fast rewards.</Text>
        <Text style={[type.mono, { marginTop: tokens.spacing.sm }]}>NEXT: Quest cards</Text>
      </GlassCard>
    </Screen>
  );
}
