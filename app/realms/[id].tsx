import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Screen from '@/components/ui/Screen';
import CasperMotionSurface from '@/components/CasperMotionSurface';
import { REALMS } from '@/data/realms';
import { realmMedia } from '@/lib/casperMedia';

export default function RealmDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const realm = REALMS.find((item) => item.id === id) ?? REALMS[0];
  const index = REALMS.findIndex((item) => item.id === realm.id);
  const next = REALMS[(index + 1) % REALMS.length];
  const media = realmMedia(realm.id);

  return (
    <Screen variant="realm" accent={realm.accent}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.back}>← UNIVERSE</Text>
        </Pressable>

        <CasperMotionSurface media={media} style={styles.hero} dim={0.2}>
          <LinearGradient
            colors={['rgba(5,5,9,.05)', 'rgba(5,5,9,.28)', 'rgba(5,5,9,.94)']}
            locations={[0, 0.52, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroTop}>
            <Text style={[styles.realmNumber, { color: realm.accent }]}>{String(index + 1).padStart(2, '0')} / {String(REALMS.length).padStart(2, '0')}</Text>
            <View style={[styles.livePill, { borderColor: `${realm.accent}55` }]}>
              <View style={[styles.liveDot, { backgroundColor: realm.accent }]} />
              <Text style={styles.liveText}>REALM MOTION</Text>
            </View>
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.name}>{realm.name}</Text>
            <Text style={[styles.tagline, { color: realm.accent }]}>{realm.tagline}</Text>
            <Text style={styles.vibe}>{realm.description}</Text>
          </View>
        </CasperMotionSurface>

        <View style={styles.brief}>
          <Text style={styles.eyebrow}>REALM IDENTITY</Text>
          <Text style={styles.headline}>A distinct brand world. One shared Casper account.</Text>
          <Text style={styles.body}>This realm carries its own voice, visual language, menu story and activation path while points, scans and eligible rewards remain connected across the Casper Universe.</Text>
        </View>

        <View style={styles.flowHead}>
          <Text style={styles.eyebrow}>HOW THIS REALM WORKS</Text>
          <Text style={styles.flowTitle}>Discover. Activate. Collect.</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cards}>
          <RealmCard index="01" title="Discover" body="Meet the brand through current approved visual identity and live Casper content." accent={realm.accent} />
          <RealmCard index="02" title="Activate" body="Scan a verified campaign, menu, product or location code tied to this realm." accent={realm.accent} />
          <RealmCard index="03" title="Collect" body="Eligible points, rewards and unlock records reconcile to your signed-in account." accent={realm.accent} />
        </ScrollView>

        <View style={styles.status}>
          <View style={[styles.statusDot, { backgroundColor: realm.accent }]} />
          <View style={styles.statusCopy}>
            <Text style={[styles.eyebrow, { color: realm.accent }]}>CURRENT PUBLIC STATUS</Text>
            <Text style={styles.statusTitle}>Identity is live. Offers only activate with published terms.</Text>
            <Text style={styles.body}>This screen does not invent a menu item, prize, discount or redemption. A benefit becomes claimable only when an approved activation publishes its dates, locations, eligibility and redemption rules.</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={() => router.push('/(tabs)/scan' as any)} style={[styles.primary, { backgroundColor: realm.accent }]}>
            <Text style={styles.primaryText}>SCAN A VERIFIED CODE</Text>
          </Pressable>
          <Pressable onPress={() => router.push(`/realms/${next.id}` as any)} style={styles.secondary}>
            <Text style={styles.secondaryLabel}>NEXT REALM</Text>
            <Text style={styles.secondaryText}>{next.name.toUpperCase()} →</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

function RealmCard({ index, title, body, accent }: { index: string; title: string; body: string; accent: string }) {
  return (
    <View style={styles.card}>
      <Text style={[styles.cardIndex, { color: accent }]}>{index}</Text>
      <View style={[styles.cardLine, { backgroundColor: `${accent}66` }]} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 110 },
  backButton: { alignSelf: 'flex-start', marginBottom: 18, paddingVertical: 8 },
  back: { color: 'rgba(245,240,232,.58)', fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  hero: { minHeight: 520, borderRadius: 30, padding: 22, justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(245,240,232,.12)' },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  realmNumber: { fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 10, backgroundColor: 'rgba(7,7,11,.62)', borderWidth: 1 },
  liveDot: { width: 6, height: 6, borderRadius: 99 },
  liveText: { color: '#F5F0E8', fontSize: 8, fontWeight: '900', letterSpacing: 1.5 },
  heroCopy: { marginTop: 'auto' },
  name: { color: '#FFFDF8', fontSize: 47, lineHeight: 48, fontWeight: '900', letterSpacing: -2.2 },
  tagline: { fontSize: 15, fontWeight: '800', marginTop: 9 },
  vibe: { color: 'rgba(245,240,232,.6)', fontSize: 12, fontWeight: '700', letterSpacing: .4, marginTop: 7 },
  brief: { paddingVertical: 50 },
  eyebrow: { color: 'rgba(245,240,232,.42)', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  headline: { color: '#FFFDF8', fontSize: 31, lineHeight: 35, fontWeight: '800', letterSpacing: -1.2, marginTop: 14 },
  body: { color: 'rgba(245,240,232,.56)', fontSize: 13, lineHeight: 21, marginTop: 13 },
  flowHead: { marginBottom: 16 },
  flowTitle: { color: '#FFFDF8', fontSize: 24, lineHeight: 28, fontWeight: '800', letterSpacing: -.8, marginTop: 8 },
  cards: { gap: 10, paddingRight: 18 },
  card: { width: 245, minHeight: 220, padding: 20, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(245,240,232,.1)', backgroundColor: 'rgba(245,240,232,.035)' },
  cardIndex: { fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  cardLine: { width: 34, height: 1, marginTop: 18 },
  cardTitle: { color: '#FFFDF8', fontSize: 22, fontWeight: '800', marginTop: 42 },
  cardBody: { color: 'rgba(245,240,232,.5)', fontSize: 12, lineHeight: 19, marginTop: 8 },
  status: { marginTop: 48, paddingVertical: 30, flexDirection: 'row', gap: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(245,240,232,.1)' },
  statusDot: { width: 9, height: 9, borderRadius: 99, marginTop: 2 },
  statusCopy: { flex: 1 },
  statusTitle: { color: '#FFFDF8', fontSize: 22, lineHeight: 27, fontWeight: '800', marginTop: 12 },
  actions: { gap: 10, marginTop: 34 },
  primary: { borderRadius: 16, padding: 18, alignItems: 'center' },
  primaryText: { color: '#080604', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  secondary: { borderRadius: 16, padding: 17, borderWidth: 1, borderColor: 'rgba(245,240,232,.14)' },
  secondaryLabel: { color: 'rgba(245,240,232,.38)', fontSize: 8, fontWeight: '900', letterSpacing: 1.5 },
  secondaryText: { color: '#FFFDF8', fontSize: 11, fontWeight: '900', letterSpacing: 1, marginTop: 5 },
});