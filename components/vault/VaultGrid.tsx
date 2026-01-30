import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import GlassCard from '@/components/ui/GlassCard';
import { tokens } from '@/lib/ui/tokens';
import { type } from '@/lib/ui/type';

type Item = { id: string; name: string; subtitle?: string; reward?: any; };

export default function VaultGrid({ items, onOpen }: { items: Item[]; onOpen: (item: Item) => void; }) {
    return (
        <FlatList
            data={items}
            keyExtractor={(x) => x.id}
            numColumns={2}
            columnWrapperStyle={{ gap: tokens.spacing.md }}
            contentContainerStyle={{ gap: tokens.spacing.md, paddingBottom: tokens.spacing.xl }}
            renderItem={({ item }) => (
                <GlassCard glow onPress={() => onOpen(item)} style={styles.crate}>
                    <View style={{ gap: tokens.spacing.xs }}>
                        <Text style={type.h3}>{item.name}</Text>
                        {!!item.subtitle && <Text style={type.caption}>{item.subtitle}</Text>}
                        <View style={styles.crack} />
                        <Text style={type.mono}>OPEN</Text>
                    </View>
                </GlassCard>
            )}
        />
    );
}

const styles = StyleSheet.create({
    crate: { flex: 1, minHeight: 140, justifyContent: 'flex-end' },
    crack: {
        height: 2,
        borderRadius: 99,
        backgroundColor: 'rgba(245,197,66,0.35)',
        marginTop: tokens.spacing.sm,
        marginBottom: tokens.spacing.sm,
    },
});
