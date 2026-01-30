import React, { useEffect } from 'react';
import { Modal, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { theme } from '@/lib/theme';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { LootReward } from '@/lib/rewards';

export function LootChestModal({
  visible,
  rewards,
  onClose,
}: {
  visible: boolean;
  rewards: LootReward[];
  onClose: () => void;
}) {
  const scale = useSharedValue(0.85);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 12, stiffness: 140 });
    }
  }, [visible, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  const totalPoints = rewards
    .filter((r) => r.type === 'points')
    .reduce((sum, r) => sum + (r.type === 'points' ? r.amount : 0), 0);

  return (
    <Modal transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.72)',
          justifyContent: 'center',
          padding: 18,
        }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: 'rgba(18,18,26,0.94)',
              borderRadius: 28,
              padding: 18,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.10)',
            },
            style,
          ]}
        >
          <Text
            style={{
              color: theme.gold,
              fontWeight: '900',
              letterSpacing: 2,
              fontSize: 10,
            }}
          >
            LOOT DROP UNLOCKED
          </Text>

          <Text
            style={{
              color: theme.text,
              fontSize: 22,
              fontWeight: '900',
              marginTop: 10,
            }}
          >
            🎁 Reward Acquired
          </Text>

          <Text style={{ color: theme.muted, marginTop: 10, lineHeight: 18 }}>
            {totalPoints > 0 ? `+${totalPoints} Power Points added.` : 'Perk unlocked.'}
          </Text>

          <View style={{ marginTop: 14, gap: 10 }}>
            {rewards.map((r, idx) => (
              <View
                key={`${r.type}-${idx}`}
                style={{
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.08)',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderRadius: 16,
                  padding: 12,
                }}
              >
                <Text style={{ color: theme.text, fontWeight: '800' }}>{r.label}</Text>
                {r.type === 'perk' && (
                  <Text style={{ color: theme.muted, marginTop: 4 }}>Perk ID: {r.perkId}</Text>
                )}
              </View>
            ))}
          </View>

          <View style={{ marginTop: 16 }}>
            <PrimaryButton title="CLAIM →" onPress={onClose} tone="gold" />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
