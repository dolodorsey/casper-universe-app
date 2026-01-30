import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import GlassCard from '@/components/ui/GlassCard';
import { type } from '@/lib/ui/type';
import { tokens } from '@/lib/ui/tokens';
import { REALMS } from '@/data/realms';

export default function RealmCarousel({ onEnter }: { onEnter: (realmId: string) => void }) {
    return (
        <View style={{ gap: tokens.spacing.sm }}>
            <Text style={type.h2}>Your Realms</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: tokens.spacing.md }}>
                {REALMS.map((r) => (
                    <GlassCard key={r.id} glow onPress={() => onEnter(r.id)} style={styles.card}>
                        <Text style={type.h3}>{r.name}</Text>
                        <Text style={type.caption}>{r.tagline}</Text>
                        <View style={[styles.accentBar, { backgroundColor: r.accent }]} />
                        <Text style={type.mono}>ENTER</Text>
                    </GlassCard>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { width: 220 },
    accentBar: { height: 3, borderRadius: 99, marginTop: 16, marginBottom: 10, opacity: 0.85 },
});
