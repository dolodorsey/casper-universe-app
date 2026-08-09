import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/stores/useGameStore';
import { REALMS } from '@/data/realms';
import { LinearGradient } from 'expo-linear-gradient';
import { loadCatalogBrands } from '@/lib/catalog';

const PATHS = [
  { id: 'scan', title: 'Scan an activation', body: 'Use a Casper QR code to open a verified experience.', icon: '⌁', href: '/(tabs)/scan' },
  { id: 'realms', title: 'Enter every realm', body: 'Explore the identity and intended experience of all 12 entities.', icon: '◈', href: '/realms/angel-wings' },
  { id: 'vault', title: 'Review your vault', body: 'See account points and the current reward-preview collection.', icon: '◇', href: '/(tabs)/vault' },
];

const TIER_COLORS: Record<string, string> = {
  Bronze: '#CD7F32', Silver: '#C0C0C0', Gold: '#FFD700', Diamond: '#B9F2FF',
};

export default function HomeScreen() {
  const router = useRouter();
  const { points, streak, unlockedPerks } = useGameStore();
  const tier = points >= 10000 ? 'Diamond' : points >= 5000 ? 'Gold' : points >= 1000 ? 'Silver' : 'Bronze';
  const [realms, setRealms] = useState(REALMS);
  const current = realms[0] ?? REALMS[0];
  const tierColor = TIER_COLORS[tier] || '#FFD700';

  useEffect(() => {
    loadCatalogBrands()
      .then((rows) => {
        if (rows.length > 0) {
          setRealms(rows.map((row) => ({
            id: row.id,
            name: row.name,
            tagline: row.tagline ?? '',
            description: row.description ?? '',
            accent: row.primary_color ?? '#D4B87A',
          })));
        }
      })
      .catch(() => {});
  }, []);

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
          <StatPill label="Realms" value={realms.length.toString()} />
          <StatPill label="Collected" value={unlockedPerks.length.toString()} />
          <StatPill label="Streak" value={`${streak}d`} />
        </View>
      </View>

      {/* ── WORKING PATHS ── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Choose your entry point</Text>
        <Text style={s.sectionSub}>Every card below opens a real app destination</Text>
        <View style={s.pathGrid}>
          {PATHS.map((path) => (
            <TouchableOpacity key={path.id} onPress={() => router.push(path.href as any)} activeOpacity={0.82} style={s.pathCard}>
              <Text style={s.pathIcon}>{path.icon}</Text>
              <Text style={s.pathTitle}>{path.title}</Text>
              <Text style={s.pathBody}>{path.body}</Text>
              <Text style={s.pathAction}>OPEN →</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={s.statusNote}>
          <Text style={s.statusLabel}>CURRENT STATUS</Text>
          <Text style={s.statusText}>Points shown above are account data. Reward items remain a preview until a specific promotion publishes its dates, locations, eligibility, and redemption terms.</Text>
        </View>
      </View>

      {/* ── REALMS ── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Realms</Text>
        <Text style={s.sectionSub}>Enter a realm to collect mascots</Text>
        {realms.map((realm) => (
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

      {/* ── EXPERIENCE STANDARD ── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>The Universe standard</Text>
        <Text style={s.sectionSub}>What every future activation must make clear</Text>
        <View style={s.standardRow}><Text style={s.standardIndex}>01</Text><View><Text style={s.standardTitle}>Verified source</Text><Text style={s.standardBody}>A code must come from an approved Casper campaign, menu, product, or location.</Text></View></View>
        <View style={s.standardRow}><Text style={s.standardIndex}>02</Text><View><Text style={s.standardTitle}>Published terms</Text><Text style={s.standardBody}>Points, timing, eligibility, availability, and redemption rules belong to the activation.</Text></View></View>
        <View style={s.standardRow}><Text style={s.standardIndex}>03</Text><View><Text style={s.standardTitle}>Account record</Text><Text style={s.standardBody}>A real unlock should reconcile with the signed-in account—not exist only as an animation.</Text></View></View>
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
  pathGrid: { gap: 10, marginTop: 14 },
  pathCard: { minHeight: 150, backgroundColor: 'rgba(255,255,255,0.045)', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)' },
  pathIcon: { color: '#FFD700', fontSize: 24 },
  pathTitle: { color: '#fff', fontSize: 17, fontWeight: '700', marginTop: 18 },
  pathBody: { color: '#777', fontSize: 13, lineHeight: 19, marginTop: 6, maxWidth: 420 },
  pathAction: { color: '#FFD700', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginTop: 18 },
  statusNote: { marginTop: 14, borderRadius: 14, padding: 18, backgroundColor: 'rgba(255,215,0,.06)', borderWidth: 1, borderColor: 'rgba(255,215,0,.18)' },
  statusLabel: { color: '#FFD700', fontSize: 9, fontWeight: '800', letterSpacing: 2 },
  statusText: { color: '#aaa', fontSize: 12, lineHeight: 19, marginTop: 8 },
  realmCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 16, marginTop: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  realmAccent: { width: 4, height: 40, borderRadius: 2, marginRight: 14 },
  realmInfo: { flex: 1 },
  realmName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  realmDesc: { color: '#555', fontSize: 12, marginTop: 2 },
  realmArrow: { color: '#444', fontSize: 20, fontWeight: '300' },
  standardRow: { flexDirection: 'row', gap: 16, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,.08)' },
  standardIndex: { color: '#FFD700', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  standardTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  standardBody: { color: '#666', fontSize: 12, lineHeight: 18, marginTop: 5, maxWidth: 430 },
});
