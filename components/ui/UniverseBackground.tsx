import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { tokens } from '@/lib/ui/tokens';

const { width } = Dimensions.get('window');

type Props = {
    variant?: 'default' | 'realm' | 'dark';
    accent?: string; // realm accent
};

export default function UniverseBackground({ variant = 'default', accent }: Props) {
    const drift = useSharedValue(0);

    React.useEffect(() => {
        drift.value = withRepeat(withTiming(1, { duration: 12000 }), -1, true);
    }, []);

    const blobStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: (drift.value * 26) - 13 },
            { translateY: (drift.value * 18) - 9 },
        ],
    }));

    const colors = useMemo(() => {
        const a = accent ?? tokens.colors.gold;
        if (variant === 'dark') return [tokens.colors.bg0, tokens.colors.bg0];
        if (variant === 'realm') return [tokens.colors.bg0, a + '22', tokens.colors.bg1];
        return [tokens.colors.bg0, tokens.colors.bg1];
    }, [variant, accent]);

    return (
        <View style={StyleSheet.absoluteFill}>
            <LinearGradient
                colors={colors as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <Animated.View style={[styles.blob, blobStyle]} />

            <View pointerEvents="none" style={styles.noise} />
        </View>
    );
}

const styles = StyleSheet.create({
    blob: {
        position: 'absolute',
        width: width * 1.1,
        height: width * 1.1,
        borderRadius: 9999,
        top: -width * 0.3,
        left: -width * 0.25,
        backgroundColor: 'rgba(245,197,66,0.12)',
        opacity: 0.55,
    },
    noise: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
});
