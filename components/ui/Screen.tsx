import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UniverseBackground from './UniverseBackground';
import { tokens } from '@/lib/ui/tokens';

type Props = {
    children: React.ReactNode;
    scroll?: boolean;
    variant?: 'default' | 'realm' | 'dark';
    accent?: string;
    contentStyle?: ViewStyle;
};

export default function Screen({ children, scroll = true, variant = 'default', accent, contentStyle }: Props) {
    return (
        <View style={styles.root}>
            <UniverseBackground variant={variant} accent={accent} />
            <SafeAreaView style={styles.safe}>
                {scroll ? (
                    <ScrollView
                        contentContainerStyle={[styles.content, contentStyle]}
                        showsVerticalScrollIndicator={false}
                    >
                        {children}
                    </ScrollView>
                ) : (
                    <View style={[styles.content, contentStyle]}>{children}</View>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: tokens.colors.bg0 },
    safe: { flex: 1 },
    content: { padding: tokens.spacing.lg, gap: tokens.spacing.md },
});
