import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import Screen from '@/components/ui/Screen';
import GlassCard from '@/components/ui/GlassCard';
import LootRevealSheet from '@/components/vault/LootRevealSheet';
import VaultGrid from '@/components/vault/VaultGrid';
import { type } from '@/lib/ui/type';
import { tokens } from '@/lib/ui/tokens';
import { REWARDS } from '@/lib/rewards';

export default function VaultScreen() {
    const [open, setOpen] = useState(false);
    const [loot, setLoot] = useState<any[]>([]);

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
