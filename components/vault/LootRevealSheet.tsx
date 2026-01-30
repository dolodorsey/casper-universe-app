import React, { useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { tokens } from '@/lib/ui/tokens';
import { type } from '@/lib/ui/type';
import { haptics } from '@/lib/ui/haptics';

export default function LootRevealSheet({
    visible,
    rewards,
    onClose,
}: {
    visible: boolean;
    rewards: any[];
    onClose: () => void;
}) {
    const ref = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['45%'], []);

    useEffect(() => {
        if (visible) {
            ref.current?.snapToIndex(0);
            haptics.confirm();
        } else {
            ref.current?.close();
        }
    }, [visible]);

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={onClose}
            backgroundStyle={styles.bg}
            handleIndicatorStyle={styles.handle}
            backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.6} />}
        >
            <View style={styles.content}>
                <Text style={type.h2}>Loot Unlocked</Text>
                <Text style={type.caption}>Added to your Vault.</Text>

                <View style={styles.list}>
                    {rewards?.map((r, i) => (
                        <View key={i} style={styles.item}>
                            <Text style={type.h3}>{r?.title ?? r?.name ?? 'Reward'}</Text>
                            {!!r?.description && <Text style={type.body}>{r.description}</Text>}
                            {!!r?.cost && <Text style={type.caption}>Cost: {r.cost} pts</Text>}
                            {/* Fallback for rewards that might not have cost/description fully defined yet */}
                            {!r?.description && !r?.cost && <Text style={type.caption}>Rare Item</Text>}
                        </View>
                    ))}
                </View>
                <Text style={type.mono}>NEXT: Add Share + Use Now buttons</Text>
            </View>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    bg: {
        backgroundColor: 'rgba(10,10,16,0.94)',
        borderTopLeftRadius: 34,
        borderTopRightRadius: 34,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
    },
    handle: { backgroundColor: 'rgba(255,255,255,0.10)', width: 50 },
    content: { padding: 24, gap: 16 },
    list: { gap: 16, marginTop: 10 },
    item: {
        padding: 16,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
        gap: 6,
    },
});
