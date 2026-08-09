import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { AnimatedIn } from '@/components/animations/AnimatedIn';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import Screen from '@/components/ui/Screen';
import { supabase } from '@/lib/supabase';
import { type } from '@/lib/ui/type';
import { tokens } from '@/lib/ui/tokens';
import { useGameStore } from '@/stores/useGameStore';

export default function ScanWebScreen() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const syncFromServer = useGameStore((state) => state.syncFromServer);

  const redeemCode = async () => {
    const token = code.trim();
    if (!token || busy) return;
    setBusy(true);
    setMessage('');
    try {
      const { data, error } = await supabase.rpc('redeem_qr_token', { p_token: token });
      if (error) {
        setMessage(error.message);
      } else if (!data?.success) {
        setMessage(data?.error ?? 'This code could not be redeemed.');
      } else {
        await syncFromServer();
        setCode('');
        setMessage(`Verified: +${data.points_earned} points`);
      }
    } catch {
      setMessage('Reward verification is temporarily unavailable. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <View style={styles.center}>
        <AnimatedIn delay={0}>
          <Text style={type.h1}>Unlock a Loot Drop</Text>
          <Text style={styles.description}>
            Enter the code printed beneath a Casper Universe QR code. Every reward is verified by
            the same secure redemption service used by the mobile app.
          </Text>
          <Text style={styles.label}>Loot drop code</Text>
          <TextInput
            accessibilityLabel="Loot drop code"
            autoCapitalize="characters"
            autoCorrect={false}
            editable={!busy}
            onChangeText={setCode}
            onSubmitEditing={redeemCode}
            placeholder="CASPER CODE"
            placeholderTextColor={tokens.colors.text2}
            style={styles.input}
            value={code}
          />
          {message ? <Text style={styles.message}>{message}</Text> : null}
          {busy ? (
            <ActivityIndicator color={tokens.colors.gold} style={styles.button} />
          ) : (
            <PrimaryButton title="Verify Code" onPress={redeemCode} style={styles.button} />
          )}
        </AnimatedIn>
      </View>
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
  message: {
    color: tokens.colors.text1,
    marginTop: tokens.spacing.sm,
  },
  button: {
    marginTop: tokens.spacing.lg,
  },
});
