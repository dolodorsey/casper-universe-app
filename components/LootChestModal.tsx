import React, { useEffect } from "react";
import { Modal, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from "react-native-reanimated";
import { theme } from "@/lib/theme";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { LootReward } from "@/lib/rewards";

export function LootChestModal({
  open,
  onClose,
  reward
}: {
  open: boolean;
  onClose: () => void;
  reward: LootReward | null;
}) {
  const scale = useSharedValue(0.85);

  useEffect(() => {
    if (open) {
      scale.value = withSpring(1, { damping: 12, stiffness: 140 });
    }
  }, [open, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  if (!open) return null;

  return (
    <Modal transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "center",
          padding: 18
        }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: "rgba(18,18,26,0.92)",
              borderRadius: 28,
              padding: 18,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.10)"
            },
            style
          ]}
        >
          <Text
            style={{
              color: theme.gold,
              fontWeight: "950",
              letterSpacing: 2,
              fontSize: 10
            }}
          >
            LOOT DROP UNLOCKED
          </Text>

          <Text
            style={{
              color: theme.text,
              fontSize: 22,
              fontWeight: "950",
              marginTop: 10
            }}
          >
            🎁 Reward Acquired
          </Text>

          <Text
            style={{
              color: theme.muted,
              marginTop: 10,
              lineHeight: 18
            }}
          >
            {reward?.label ?? "You unlocked something rare."}
          </Text>

          <View style={{ marginTop: 14 }}>
            <PrimaryButton title="CLAIM →" onPress={onClose} tone="gold" />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
