import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import Screen from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { LootChestModal } from '@/components/LootChestModal';
import { generateLootDrop } from '@/lib/lootEngine';
import { AnimatedIn } from '@/components/animations/AnimatedIn';
import { useGameStore } from '@/stores/useGameStore';
import { type } from '@/lib/ui/type';
import { tokens } from '@/lib/ui/tokens';

export default function ScanWebScreen() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [lootVisible, setLootVisible] = useState(false);
  const [lootRewards, setLootRewards] = useState<any[]>([]);
  const { addPoints, tier } = useGameStore();

  const redeemCode = () => {
    const normalized = code.trim().toLowerCase();
    if (!normalized.includes('casper-universe') && !normalized.includes('loot-drop')) {
      setMessage('That code is not a valid Casper Universe loot drop.');
      return;
    }

    const rewards = generateLootDrop(tier);
    addPoints(rewards.reduce((sum, reward) => sum + reward.points, 0));
    setLootRewards(rewards);
    setMessage('');
    setLootVisible(true);
  };

  return (
    <Screen>
      <View style={styles.center}>
        <AnimatedIn delay={0}>
          <Text style={type.h1}>Unlock a Loot Drop</Text>
          <Text style={styles.description}>
            Enter the code printed beneath a Casper Universe QR code. Camera scanning is available in
            the mobile app.
          </Text>
          <Text style={styles.label}>Loot drop code</Text>
          <TextInput
            accessibilityLabel="Loot drop code"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setCode}
            onSubmitEditing={redeemCode}
            placeholder="casper-universe-…"
            placeholderTextColor={tokens.colors.text2}
            style={styles.input}
            value={code}
          />
          {message ? <Text style={styles.error}>{message}</Text> : null}
          <PrimaryButton
            title="Unlock Reward"
            onPress={redeemCode}
            style={styles.button}
          />
        </AnimatedIn>
      </View>
      <LootChestModal
        visible={lootVisible}
        rewards={lootRewards}
        onClose={() => {
          setLootVisible(false);
          setCode('');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    padding: tokens.spacing.xl,
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
  },
  description: {
    ...type.body,
    color: tokens.colors.text1,
    marginVertical: tokens.spacing.lg,
  },
  label: {
    ...type.body,
    color: tokens.colors.text0,
    marginBottom: tokens.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.surface1,
    color: tokens.colors.text0,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    fontSize: 16,
  },
  error: {
    color: '#ff7a8a',
    marginTop: tokens.spacing.sm,
  },
  button: {
    marginTop: tokens.spacing.lg,
  },
});
