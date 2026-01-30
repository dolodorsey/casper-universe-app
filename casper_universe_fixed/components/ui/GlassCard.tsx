import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../lib/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  neonColor?: 'blue' | 'purple' | 'pink' | 'green' | 'gray';
  variant?: 'default' | 'gradient';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  neonColor = 'blue',
  variant = 'default',
}) => {
  const neonKey = `neon${neonColor.charAt(0).toUpperCase() + neonColor.slice(1)}` as keyof typeof theme.colors;
  const neonShadow = {
    shadowColor: neonColor === 'gray' ? 'rgba(255,255,255,0.10)' : (theme.colors[neonKey] as string),
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  };

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[theme.colors.glassLight, theme.colors.glassDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, neonShadow, style]}
      >
        <View style={styles.content}>{children}</View>
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.container, neonShadow, style]}>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.glassDark,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    overflow: 'hidden',
  },
  content: {
    padding: theme.spacing.md,
  },
});
