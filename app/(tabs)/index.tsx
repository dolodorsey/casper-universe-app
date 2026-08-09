import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '@/stores/useGameStore';
import { REALMS } from '@/data/realms';
import { loadCatalogBrands } from '@/lib/catalog';
import CasperMotionSurface from '@/components/CasperMotionSurface';
import { CASPER_GALLERY, CASPER_HERO_MOTION, CASPER_HERO_POSTER, realmMedia } from '@/lib/casperMedia';

const PATHS = [
  { id: 'scan', title: 'Scan', body: 'Unlock a verified Casper activation.', icon: '⌁', href: '/(tabs)/scan' },
  { id: 'vault', title: 'Vault', body: 'Points, rewards and collected records.', icon: '◇', href: '/(tabs)/vault' },
  { id: 'rewards', title: 'Rewards', body: 'See what is actually available to redeem.', icon: '✦', href: '/(tabs)/rewards' },
];

const TIER_COLORS: Record<string, string> = {
  Bronze: '#CD7F32', Silver: '#C0C0C0', Gold: '#FFD700', Diamond: '#B9F2FF',
};

export default function HomeScreen() {
  const router = useRouter();
  const { points, streak, unlockedPerks } = useGameStore();
  const tier = points >= 10000 ? 'Diamond' : points >= 5000 ? 'Gold' : points >= 1000 ? 'Silver' : 'Bronze';
  const [realms, setRealms] = useState(REALMS);
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
      <ImageBackground source={{ uri: CASPER_HERO_POSTER }} resizeMode="cover" style={s.hero} imageStyle={s.heroImage}>
        <LinearGradient
          colors={['rgba(4,4,8,.12)', 'rgba(4,4,8,.42)', '#08080D']}
          locations={[0, 0.56, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={s.heroTop}>
          <View style={s.livePill}><View style={s.liveDot} /><Text style={s.liveText}>CASPER UNIVERSE</Text></View>
          <View style={[s.tierPill, { borderColor: `${tierColor}66` }]}>
            <Text style={[s.tierText, { color: tierColor }]}>{tier}</Text>
            <Text style={s.tierPoints}>{points.toLocaleString()} XP</Text>
          </View>
        </View>

        <View style={s.heroCopy}>
          <Text style={s.heroEyebrow}>THE CUSTOMER UNIVERSE</Text>
          <Text style={s.heroTitle}>Twelve brands. One living world.</Text>
          <Text style={s.heroSub}>Explore every Casper realm, collect verified activations, and keep everything you earn in one account.</Text>
        </View>

        <View style={s.heroMotionWrap}>
          <Image source={{ uri: CASPER_HERO_MOTION }} resizeMode="cover" style={s.heroMotion} />
        </View>

        <View style={s.heroStats}>
          <StatPill label="Realms" value={realms.length.toString()} />
          <StatPill label="Collected" value={unlockedPerks.length.toString()} />
          <StatPill label="Streak" value={`${streak}d`} />
        </View>
      </ImageBackground>

      <View style={s.quickSection}>
        <Text style={s.sectionEyebrow}>START HERE</Text>
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
      </View>

      <View style={s.section}>
        <View style={s.sectionHead}>
          <View>
            <Text style={s.sectionEyebrow}>THE REALMS</Text>
            <Text style={s.sectionTitle}>Enter the portfolio.</Text>
          </View>
          <Text style={s.sectionCount}>{realms.length}</Text>
        </View>
        <Text style={s.sectionSub}>Every brand gets its own visual world while your points, scans and rewards stay connected.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.realmRail}>
          {realms.map((realm, index) => (
            <TouchableOpacity
              key={realm.id}
              onPress={() => router.push(`/realms/${realm.id}` as any)}
              activeOpacity={0.9}
              style={s.realmTouch}
            >
              <CasperMotionSurface media={realmMedia(realm.id)} style={s.realmCard} dim={0.3}>
                <LinearGradient colors={['transparent', 'rgba(4,4,7,.3)', 'rgba(4,4,7,.95)']} style={StyleSheet.absoluteFill} />
                <View style={s.realmTopline}>
                  <Text style={[s.realmIndex, { color: realm.accent || '#D4B87A' }]}>{String(index + 1).padStart(2, '0')}</Text>
                  <View style={[s.realmDot, { backgroundColor: realm.accent || '#D4B87A' }]} />
                </View>
                <View style={s.realmCopy}>
                  <Text style={s.realmName}>{realm.name}</Text>
                  <Text style={[s.realmTagline, { color: realm.accent || '#D4B87A' }]}>{realm.tagline}</Text>
                  <Text numberOfLines={2} style={s.realmDesc}>{realm.description || 'Explore this Casper realm.'}</Text>
                  <Text style={s.realmAction}>ENTER REALM →</Text>
                </View>
              </CasperMotionSurface>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={s.section}>
        <Text style={s.sectionEyebrow}>CASPER VISUAL ARCHIVE</Text>
        <Text style={s.sectionTitle}>Inside the Universe.</Text>
        <Text style={s.sectionSub}>Current approved Casper artwork from the shared creative library.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.galleryRail}>
          {CASPER_GALLERY.map((uri, index) => (
            <View key={uri} style={s.galleryCard}>
              <Image source={{ uri }} resizeMode="cover" style={s.galleryImage} />
              <LinearGradient colors={['transparent', 'rgba(4,4,7,.8)']} style={StyleSheet.absoluteFill} />
              <Text style={s.galleryIndex}>{String(index + 1).padStart(2, '0')}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={s.section}>
        <View style={s.truthCard}>
          <Text style={s.truthEyebrow}>LIVE ACCOUNT TRUTH</Text>
          <Text style={s.truthTitle}>Beautiful never means fake.</Text>
          <Text style={s.truthBody}>Visual realms can move now. Points, rewards, redemptions and unlocks only appear as earned when a verified activation writes the record to your account.</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/scan' as any)} activeOpacity={0.82} style={s.truthButton}>
            <Text style={s.truthButtonText}>SCAN A VERIFIED CODE</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 110 }} />
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
  container: { flex: 1, backgroundColor: '#08080D' },
  hero: { minHeight: 690, paddingTop: 56, paddingHorizontal: 20, paddingBottom: 28, justifyContent: 'flex-end', position: 'relative', overflow: 'hidden' },
  heroImage: { backgroundColor: '#08080D' },
  heroTop: { position: 'absolute', top: 54, left: 20, right: 20, zIndex: 3, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 8, paddingHorizontal: 11, borderRadius: 999, backgroundColor: 'rgba(8,8,13,.72)', borderWidth: 1, borderColor: 'rgba(255,255,255,.12)' },
  liveDot: { width: 6, height: 6, borderRadius: 99, backgroundColor: '#E7C86E' },
  liveText: { color: '#F5F0E8', fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  tierPill: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 8, paddingHorizontal: 11, borderRadius: 999, backgroundColor: 'rgba(8,8,13,.72)', borderWidth: 1 },
  tierText: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, textTransform: 'uppercase' },
  tierPoints: { color: 'rgba(245,240,232,.62)', fontSize: 9, fontWeight: '700' },
  heroCopy: { zIndex: 3, maxWidth: 560 },
  heroEyebrow: { color: '#E7C86E', fontSize: 9, fontWeight: '900', letterSpacing: 2.3 },
  heroTitle: { color: '#FFFDF8', fontSize: 48, lineHeight: 49, fontWeight: '900', letterSpacing: -2.1, marginTop: 12 },
  heroSub: { color: 'rgba(245,240,232,.7)', fontSize: 14, lineHeight: 21, marginTop: 13, maxWidth: 510 },
  heroMotionWrap: { zIndex: 3, width: 94, height: 94, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(231,200,110,.42)', marginTop: 20, backgroundColor: '#0B0B10' },
  heroMotion: { width: '100%', height: '100%' },
  heroStats: { zIndex: 3, flexDirection: 'row', gap: 8, marginTop: 20 },
  statPill: { flex: 1, backgroundColor: 'rgba(9,9,14,.68)', borderRadius: 16, paddingVertical: 13, paddingHorizontal: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,.1)' },
  statValue: { color: '#FFFDF8', fontSize: 19, fontWeight: '800' },
  statLabel: { color: 'rgba(245,240,232,.48)', fontSize: 9, marginTop: 3, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '800' },
  quickSection: { paddingHorizontal: 20, marginTop: 24 },
  section: { marginTop: 48 },
  sectionHead: { paddingHorizontal: 20, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionEyebrow: { color: '#D4B87A', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  sectionTitle: { color: '#FFFDF8', fontSize: 30, lineHeight: 33, fontWeight: '800', letterSpacing: -1.2, marginTop: 8, paddingHorizontal: 20 },
  sectionCount: { color: 'rgba(245,240,232,.2)', fontSize: 42, fontWeight: '900', lineHeight: 42 },
  sectionSub: { color: 'rgba(245,240,232,.48)', fontSize: 13, lineHeight: 20, marginTop: 8, paddingHorizontal: 20, maxWidth: 600 },
  pathGrid: { flexDirection: 'row', gap: 8, marginTop: 12 },
  pathCard: { flex: 1, minHeight: 150, backgroundColor: 'rgba(255,255,255,.045)', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,.09)' },
  pathIcon: { color: '#E7C86E', fontSize: 21 },
  pathTitle: { color: '#FFFDF8', fontSize: 15, fontWeight: '800', marginTop: 18 },
  pathBody: { color: 'rgba(245,240,232,.42)', fontSize: 11, lineHeight: 16, marginTop: 5 },
  pathAction: { color: '#E7C86E', fontSize: 8, fontWeight: '900', letterSpacing: 1.2, marginTop: 'auto', paddingTop: 13 },
  realmRail: { paddingHorizontal: 20, gap: 12, paddingTop: 18, paddingBottom: 4 },
  realmTouch: { width: 286 },
  realmCard: { height: 390, borderRadius: 26, padding: 18, justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255,255,255,.12)' },
  realmTopline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  realmIndex: { fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  realmDot: { width: 8, height: 8, borderRadius: 99 },
  realmCopy: { marginTop: 'auto' },
  realmName: { color: '#FFFDF8', fontSize: 27, lineHeight: 29, fontWeight: '900', letterSpacing: -1 },
  realmTagline: { fontSize: 12, fontWeight: '800', marginTop: 7 },
  realmDesc: { color: 'rgba(245,240,232,.58)', fontSize: 11, lineHeight: 17, marginTop: 8 },
  realmAction: { color: '#FFFDF8', fontSize: 9, fontWeight: '900', letterSpacing: 1.4, marginTop: 18 },
  galleryRail: { paddingHorizontal: 20, gap: 10, paddingTop: 18 },
  galleryCard: { width: 268, height: 178, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,.1)', backgroundColor: '#0D0D14' },
  galleryImage: { width: '100%', height: '100%' },
  galleryIndex: { position: 'absolute', bottom: 12, left: 14, color: 'rgba(255,255,255,.72)', fontSize: 9, fontWeight: '900', letterSpacing: 1.6 },
  truthCard: { marginHorizontal: 20, borderRadius: 28, padding: 24, backgroundColor: '#111017', borderWidth: 1, borderColor: 'rgba(231,200,110,.2)' },
  truthEyebrow: { color: '#E7C86E', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  truthTitle: { color: '#FFFDF8', fontSize: 27, lineHeight: 30, fontWeight: '850', letterSpacing: -1, marginTop: 12 },
  truthBody: { color: 'rgba(245,240,232,.55)', fontSize: 13, lineHeight: 20, marginTop: 10 },
  truthButton: { marginTop: 20, borderRadius: 14, backgroundColor: '#E7C86E', paddingVertical: 16, alignItems: 'center' },
  truthButtonText: { color: '#08080D', fontSize: 9, fontWeight: '900', letterSpacing: 1.4 },
});