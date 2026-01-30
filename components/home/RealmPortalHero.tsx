import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import GlassCard from '@/components/ui/GlassCard';
import { tokens } from '@/lib/ui/tokens';
import { type } from '@/lib/ui/type';

export default function RealmPortalHero({ realmName, accent, points, tier }: { realmName: string; accent: string; points: number; tier: string; }) {
    const pulse = useSharedValue(0);

    useEffect(() => {
        pulse.value = withRepeat(withTiming(1, { duration: 1400 }), -1, true);
    }, []);

    const ring = useAnimatedStyle(() => ({
        opacity: 0.65,
        transform: [{ scale: 1 + pulse.value * 0.03 }],
    }));

    return (
        <GlassCard glow style={styles.card}>
            <View style={styles.topRow}>
                <View style={{ gap: tokens.spacing.xs }}>
                    <Text style={type.caption}>CURRENT REALM</Text>
                    <Text style={type.h1}>{realmName}</Text>
                </View>
                <View style={styles.stats}>
                    <Text style={type.mono}>{tier}</Text>
                    <Text style={type.bodyBold}>{points} pts</Text>
                </View>
            </View>

            <View style={styles.portalWrap}>
                <Animated.View style={[styles.portalRing, ring, { borderColor: accent }]} />
                <View style={[styles.portalCore, { backgroundColor: accent + '22' }]} />
            </View>

            <Text style={type.body}>Enter the Realm. Complete quests. Open crates.</Text>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    card: { minHeight: 220 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    stats: { alignItems: 'flex-end', gap: 6 },
    portalWrap: { marginTop: 16, marginBottom: 16, alignItems: 'center', justifyContent: 'center' },
    portalRing: { width: 140, height: 140, borderRadius: 999, borderWidth: 2, position: 'absolute' },
    portalCore: { width: 110, height: 110, borderRadius: 999 },
});
