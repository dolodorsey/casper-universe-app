import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Screen from '@/components/ui/Screen';
import GlassCard from '@/components/ui/GlassCard';
import LootRevealSheet from '@/components/vault/LootRevealSheet';
import VaultGrid from '@/components/vault/VaultGrid';
import { type } from '@/lib/ui/type';
import { tokens } from '@/lib/ui/tokens';
import { REWARDS } from '@/lib/rewards';
import { useAuth } from '@/lib/auth';
import { useGameStore } from '@/stores/useGameStore';

export default function VaultScreen() {
    const [open, setOpen] = useState(false);
    const [loot, setLoot] = useState<any[]>([]);
    const { user, signOut } = useAuth();
    const points = useGameStore((s) => s.points);
    const streak = useGameStore((s) => s.streak);

    const crates = useMemo(() => REWARDS.slice(0, 8).map((r, idx) => ({
        id: `crate-${idx}`,
        name: 'Mystery Crate',
        subtitle: 'Tap to open',
        reward: r,
    })), []);

    return (
        <Screen>
            <View style={{ gap: tokens.spacing.sm }}>
                <Text style={type.h1}>Vault</Text>
                <Text style={type.body}>Crates, perks, and badges you’ve unlocked.</Text>
            </View>

            {/* Profile + stats */}
            <GlassCard>
                <Text style={vstyles.email}>{user?.email ?? 'guest'}</Text>
                <View style={vstyles.statsRow}>
                    <View style={vstyles.statBlock}>
                        <Text style={vstyles.statValue}>{points}</Text>
                        <Text style={vstyles.statLabel}>POINTS</Text>
                    </View>
                    <View style={vstyles.statDivider} />
                    <View style={vstyles.statBlock}>
                        <Text style={vstyles.statValue}>{streak}</Text>
                        <Text style={vstyles.statLabel}>STREAK</Text>
                    </View>
                </View>
                <Pressable onPress={signOut} style={vstyles.signOutBtn}>
                    <Text style={vstyles.signOutText}>Sign out</Text>
                </Pressable>
            </GlassCard>

            <GlassCard glow>
                <Text style={type.h2}>Crates</Text>
                <Text style={type.caption}>Open one to reveal loot.</Text>
            </GlassCard>

            <VaultGrid
                items={crates}
                onOpen={(item) => {
                    setLoot([item.reward]);
                    setOpen(true);
                }}
            />

            <LootRevealSheet visible={open} rewards={loot} onClose={() => setOpen(false)} />
        </Screen>
    );
}

const vstyles = StyleSheet.create({
    email: {
        color: '#F5F0E8',
        fontSize: 14,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    statBlock: { flex: 1, alignItems: 'center' },
    statDivider: { width: 1, backgroundColor: 'rgba(245,240,232,0.12)' },
    statValue: {
        color: '#D4B87A',
        fontSize: 28,
        fontWeight: '600',
    },
    statLabel: {
        color: 'rgba(245,240,232,0.55)',
        fontSize: 10,
        letterSpacing: 2,
        marginTop: 4,
    },
    signOutBtn: {
        marginTop: 16,
        paddingVertical: 10,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(245,240,232,0.08)',
    },
    signOutText: {
        color: 'rgba(245,240,232,0.65)',
        fontSize: 13,
    },
});
