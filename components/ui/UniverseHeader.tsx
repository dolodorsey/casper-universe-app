import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../lib/theme';
import { HapticFeedback } from '../../lib/haptics';

interface UniverseHeaderProps {
    title?: string;
    subtitle?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightAction?: React.ReactNode;
}

export const UniverseHeader: React.FC<UniverseHeaderProps> = ({
    title = "Casper Universe",
    subtitle,
    showBack = false,
    onBack,
    rightAction,
}) => {
    return (
        <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.container}>

                    <View style={styles.leftContainer}>
                        {showBack ? (
                            <Pressable
                                onPress={() => {
                                    HapticFeedback.light();
                                    onBack?.();
                                }}
                                style={styles.iconButton}
                            >
                                <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
                            </Pressable>
                        ) : (
                            <View style={styles.logoPlaceholder}>
                                {/* Placeholder for small logo icon */}
                                <Ionicons name="sparkles" size={18} color={theme.colors.neonPurple} />
                            </View>
                        )}

                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{title}</Text>
                            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                        </View>
                    </View>

                    <View style={styles.rightContainer}>
                        {rightAction || (
                            <Pressable
                                style={styles.avatarButton}
                                onPress={() => HapticFeedback.medium()}
                            >
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>JD</Text>
                                </View>
                            </Pressable>
                        )}
                    </View>
                </View>
            </SafeAreaView>
            {/* Bottom border line */}
            <View style={styles.borderLine} />
        </BlurView>
    );
};

const styles = StyleSheet.create({
    blurContainer: {
        zIndex: 100,
    },
    safeArea: {
        backgroundColor: 'transparent',
    },
    container: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'column',
    },
    title: {
        color: theme.colors.text,
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.5,
        textShadowColor: theme.colors.neonPurple,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    subtitle: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    iconButton: {
        padding: 8,
        marginLeft: -8,
    },
    logoPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 12,
        backgroundColor: 'rgba(181, 55, 242, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(181, 55, 242, 0.4)',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarButton: {
        shadowColor: theme.colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        borderWidth: 1.5,
        borderColor: theme.colors.neonBlue,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: theme.colors.neonBlue,
        fontSize: 14,
        fontWeight: 'bold',
    },
    borderLine: {
        height: 1,
        backgroundColor: theme.colors.glassBorder,
        width: '100%',
    }
});
