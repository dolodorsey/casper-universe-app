import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/stores/useGameStore';
import { REALMS } from '@/data/realms';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DAILY_QUESTS = [
  { id: 1, title: 'Scan a Casper menu QR', xp: 50, icon: '📱', done: false },
  { id: 2, title: 'Visit any Casper location', xp: 100, icon: '📍', done: false },
  { id: 3, title: 'Share a mascot to IG Story', xp: 75, icon: '📸', done: false },
];

const DROPS = [
  { id: 1, name: 'Mystery Crate', rarity: 'Common', color: '#4A90D9', timer: '4h 23m' },
  { id: 2, name: 'Gold Vault Box', rarity: 'Rare', color: '#FFD700', timer: '11h 45m' },
  { id: 3, name: 'Obsidian Chest', rarity: 'Legendary', color: '#8B5CF6', timer: '23h 59m' },
];

const TIER_COLORS: Record<string, string> = {
  Bronze: '#CD7F32', Silver: '#C0C0C0', Gold: '#FFD700', Diamond: '#B9F2FF',
};

export default function HomeScreen() {
  const router = useRouter();
  const { points, tier } = useGameStore();
  const [claimedDrop, setClaimedDrop] = useState<number | null>(null);
  const current = REALMS[0];
  const tierColor = TIER_COLORS[tier] || '#FFD700';

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* ── HERO BANNER ── */}
      <View style={s.hero}>
        <LinearGradient colors={['#0D0D14', current.accent || '#1a1a2e', '#0D0D14']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        <View style={s.heroBadge}>
          <Text style={[s.heroTier, { color: tierColor }]}>{tier}</Text>
          <Text style={s.heroPoints}>{points.toLocaleString()} XP</Text>
        </View>
        <Text style={s.heroTitle}>CASPER{'\n'}UNIVERSE</Text>
        <Text style={s.heroSub}>Collect. Explore. Earn.</Text>
        <View style={s.heroStats}>
          <StatPill label="Realms" value={REALMS.length.toString()} />
          <StatPill label="Collected" value="0" />
          <StatPill label="Streak" value="1d" />
        </View>
      </View>

      {/* ── DAILY DROPS ── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Daily Drops</Text>
        <Text style={s.sectionSub}>Claim one free crate every day</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          {DROPS.map((drop) => (
            <TouchableOpacity key={drop.id} onPress={() => setClaimedDrop(drop.id)} activeOpacity={0.8}
              style={[s.dropCard, claimedDrop === drop.id && { borderColor: drop.color, borderWidth: 2 }]}>
              <View style={[s.dropGlow, { backgroundColor: drop.color }]} />
              <Text style={s.dropIcon}>{drop.rarity === 'Legendary' ? '💎' : drop.rarity === 'Rare' ? '✨' : '📦'}</Text>
              <Text style={s.dropName}>{drop.name}</Text>
              <Text style={[s.dropRarity, { color: drop.color }]}>{drop.rarity}</Text>
              <Text style={s.dropTimer}>{claimedDrop === drop.id ? '✅ Claimed' : `⏳ ${drop.timer}`}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── REALMS ── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Realms</Text>
        <Text style={s.sectionSub}>Enter a realm to collect mascots</Text>
        {REALMS.map((realm) => (
          <TouchableOpacity key={realm.id} onPress={() => router.push(`/realms/${realm.id}` as any)} activeOpacity={0.85} style={s.realmCard}>
            <View style={[s.realmAccent, { backgroundColor: realm.accent || '#FFD700' }]} />
            <View style={s.realmInfo}>
              <Text style={s.realmName}>{realm.name}</Text>
              <Text style={s.realmDesc}>{realm.description || 'Explore this realm'}</Text>
            </View>
            <Text style={s.realmArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── QUESTS ── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Daily Quests</Text>
        <Text style={s.sectionSub}>Complete for bonus XP</Text>
        {DAILY_QUESTS.map((q) => (
          <View key={q.id} style={s.questRow}>
            <Text style={s.questIcon}>{q.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.questTitle}>{q.title}</Text>
              <Text style={s.questXp}>+{q.xp} XP</Text>
            </View>
            <View style={[s.questBadge, q.done && { backgroundColor: '#10b981' }]}>
              <Text style={s.questBadgeText}>{q.done ? '✓' : 'GO'}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.statPill}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D14' },
  hero: { paddingTop: 60, paddingBottom: 32, paddingHorizontal: 24, position: 'relative', overflow: 'hidden' },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  heroTier: { fontSize: 12, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
  heroPoints: { fontSize: 12, color: '#888', fontWeight: '600' },
  heroTitle: { fontSize: 48, fontWeight: '800', color: '#fff', lineHeight: 50, letterSpacing: -1 },
  heroSub: { fontSize: 15, color: '#666', marginTop: 8, letterSpacing: 1 },
  heroStats: { flexDirection: 'row', gap: 12, marginTop: 24 },
  statPill: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 18, fontWeight: '700' },
  statLabel: { color: '#666', fontSize: 11, marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 },
  section: { paddingHorizontal: 24, marginTop: 32 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  sectionSub: { fontSize: 13, color: '#555', marginTop: 4 },
  dropCard: { width: 140, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16, marginRight: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' },
  dropGlow: { position: 'absolute', top: -20, right: -20, width: 60, height: 60, borderRadius: 30, opacity: 0.15 },
  dropIcon: { fontSize: 28, marginBottom: 8 },
  dropName: { color: '#fff', fontSize: 14, fontWeight: '600' },
  dropRarity: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginTop: 4, textTransform: 'uppercase' },
  dropTimer: { fontSize: 11, color: '#666', marginTop: 8 },
  realmCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 16, marginTop: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  realmAccent: { width: 4, height: 40, borderRadius: 2, marginRight: 14 },
  realmInfo: { flex: 1 },
  realmName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  realmDesc: { color: '#555', fontSize: 12, marginTop: 2 },
  realmArrow: { color: '#444', fontSize: 20, fontWeight: '300' },
  questRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 14, marginTop: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  questIcon: { fontSize: 24, marginRight: 12 },
  questTitle: { color: '#fff', fontSize: 14, fontWeight: '500' },
  questXp: { color: '#FFD700', fontSize: 12, fontWeight: '600', marginTop: 2 },
  questBadge: { backgroundColor: 'rgba(255,215,0,0.15)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6 },
  questBadgeText: { color: '#FFD700', fontSize: 12, fontWeight: '700' },
});
