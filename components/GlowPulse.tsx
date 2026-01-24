import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming
} from "react-native-reanimated";

export function GlowPulse({
  accent,
  size = 180,
  opacity = 0.18
}: {
  accent: string;
  size?: number;
  opacity?: number;
}) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1600 }), -1, true);
  }, [pulse]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 0.92 + pulse.value * 0.12 }],
    opacity: opacity + pulse.value * 0.08
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: -50,
          right: -50,
          width: size,
          height: size,
          borderRadius: 999,
          backgroundColor: accent
        },
        style
      ]}
    />
  );
}
