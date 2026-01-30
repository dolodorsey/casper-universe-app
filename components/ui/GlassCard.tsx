import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { tokens } from '@/lib/ui/tokens';
import { haptics } from '@/lib/ui/haptics';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  glow?: boolean;
  disabled?: boolean;
};

export default function GlassCard({ children, onPress, style, glow, disabled }: Props) {
  const pressed = useSharedValue(0);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? 0.985 : 1, { duration: 140 }) }],
  }));

  const CardInner = (
    <Animated.View style={[styles.card, glow && styles.glow, style, anim]}>
      <BlurView intensity={tokens.blur.low} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.inner}>{children}</View>
    </Animated.View>
  );

  if (!onPress) return CardInner;

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      onPress={() => {
        haptics.tap();
        onPress();
      }}
    >
      {CardInner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
    borderWidth: tokens.border.hairline,
    borderColor: tokens.colors.line,
    backgroundColor: tokens.colors.surface0,
  },
  glow: {
    shadowColor: tokens.colors.gold,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  inner: { padding: tokens.spacing.lg, gap: tokens.spacing.sm },
});
