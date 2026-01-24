import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

export function AnimatedIn({
  children,
  delay = 0
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(520).delay(delay)}>
      {children}
    </Animated.View>
  );
}
