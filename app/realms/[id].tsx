import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Screen from '@/components/ui/Screen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { REALMS } from '@/data/realms';

export default function RealmDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const realm = REALMS.find(r => r.id === id) ?? REALMS[0];
    const index = REALMS.findIndex(r => r.id === realm.id);
    const next = REALMS[(index + 1) % REALMS.length];

    return (
        <Screen variant="realm" accent={realm.accent}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <Pressable onPress={() => router.back()}><Text style={styles.back}>← UNIVERSE</Text></Pressable>
                <View style={[styles.orbit, { borderColor: realm.accent }]}>
                    <Text style={[styles.realmNumber, { color: realm.accent }]}>{String(index + 1).padStart(2, '0')} / {String(REALMS.length).padStart(2, '0')}</Text>
                    <Text style={styles.name}>{realm.name}</Text>
                    <Text style={[styles.tagline, { color: realm.accent }]}>{realm.tagline}</Text>
                </View>
                <View style={styles.brief}>
                    <Text style={styles.eyebrow}>REALM IDENTITY</Text>
                    <Text style={styles.headline}>A distinct world inside one Casper system.</Text>
                    <Text style={styles.body}>{realm.description}. This realm carries its own voice, visual language, menu story, mascot potential, and activation path while remaining part of the shared Casper Universe account.</Text>
                </View>
                <View style={styles.cards}>
                    <RealmCard index="01" title="Discover" body="Learn the entity’s identity and recognize its approved activations." />
                    <RealmCard index="02" title="Activate" body="Scan a verified code tied to a campaign, menu, product, or location." />
                    <RealmCard index="03" title="Collect" body="Keep eligible points, rewards, and realm records attached to your account." />
                </View>
                <View style={styles.status}>
                    <Text style={[styles.eyebrow, { color: realm.accent }]}>CURRENT PUBLIC STATUS</Text>
                    <Text style={styles.statusTitle}>Realm identity published. Live mission terms pending.</Text>
                    <Text style={styles.body}>This page does not promise a menu item, location, prize, discount, or redemption. Those details become active only when an approved activation publishes its own terms.</Text>
                </View>
                <View style={styles.actions}>
                    <Pressable onPress={() => router.push('/(tabs)/scan' as any)} style={[styles.primary, { backgroundColor: realm.accent }]}><Text style={styles.primaryText}>SCAN A CODE</Text></Pressable>
                    <Pressable onPress={() => router.push(`/realms/${next.id}` as any)} style={styles.secondary}><Text style={styles.secondaryText}>NEXT: {next.name.toUpperCase()} →</Text></Pressable>
                </View>
            </ScrollView>
        </Screen>
    );
}

function RealmCard({ index, title, body }: { index: string; title: string; body: string }) {
    return <View style={styles.card}><Text style={styles.cardIndex}>{index}</Text><Text style={styles.cardTitle}>{title}</Text><Text style={styles.cardBody}>{body}</Text></View>;
}

const styles = StyleSheet.create({
    content: { paddingBottom: 100 },
    back: { color: 'rgba(245,240,232,.55)', fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 32 },
    orbit: { minHeight: 330, borderWidth: 1, borderRadius: 180, padding: 42, justifyContent: 'center', backgroundColor: 'rgba(255,255,255,.025)' },
    realmNumber: { fontSize: 10, fontWeight: '800', letterSpacing: 2 },
    name: { color: '#F5F0E8', fontSize: 46, lineHeight: 47, fontWeight: '800', letterSpacing: -2, marginTop: 20 },
    tagline: { fontSize: 16, fontWeight: '600', marginTop: 12 },
    brief: { paddingVertical: 52 },
    eyebrow: { color: 'rgba(245,240,232,.45)', fontSize: 9, fontWeight: '800', letterSpacing: 2 },
    headline: { color: '#F5F0E8', fontSize: 30, lineHeight: 34, fontWeight: '700', letterSpacing: -1, marginTop: 16 },
    body: { color: 'rgba(245,240,232,.58)', fontSize: 14, lineHeight: 23, marginTop: 18 },
    cards: { gap: 10 },
    card: { minHeight: 180, padding: 22, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(245,240,232,.1)', backgroundColor: 'rgba(245,240,232,.035)' },
    cardIndex: { color: '#D4B87A', fontSize: 9, fontWeight: '800', letterSpacing: 2 },
    cardTitle: { color: '#F5F0E8', fontSize: 22, fontWeight: '700', marginTop: 34 },
    cardBody: { color: 'rgba(245,240,232,.5)', fontSize: 13, lineHeight: 20, marginTop: 8 },
    status: { marginTop: 44, paddingVertical: 34, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(245,240,232,.1)' },
    statusTitle: { color: '#F5F0E8', fontSize: 22, lineHeight: 27, fontWeight: '700', marginTop: 14 },
    actions: { gap: 10, marginTop: 34 },
    primary: { borderRadius: 14, padding: 18, alignItems: 'center' },
    primaryText: { color: '#080604', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
    secondary: { borderRadius: 14, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(245,240,232,.14)' },
    secondaryText: { color: '#F5F0E8', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
});
