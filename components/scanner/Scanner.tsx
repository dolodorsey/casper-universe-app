import { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import GlassCard from '@/components/ui/GlassCard';
import { supabase } from '@/lib/supabase';
import { useGameStore } from '@/stores/useGameStore';
import { tokens } from '@/lib/ui/tokens';

export default function Scanner() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const syncFromServer = useGameStore((state) => state.syncFromServer);

  const redeem = async () => {
    const token = code.trim();
    if (!token || busy) return;
    setBusy(true);
    setMessage('');
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
    setBusy(false);
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>VERIFIED ACTIVATION</Text>
        <Text style={styles.title}>Enter your Casper code</Text>
        <Text style={styles.copy}>Each active code can be redeemed once per account. Point values are verified securely.</Text>
        <GlassCard style={styles.card}>
          <TextInput
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            autoCorrect={false}
            placeholder="CASPER CODE"
            placeholderTextColor={tokens.colors.muted}
            style={styles.input}
            editable={!busy}
          />
          {busy ? <ActivityIndicator color={tokens.colors.gold} /> : <PrimaryButton title="VERIFY CODE" onPress={redeem} tone="gold" />}
          {!!message && <Text style={styles.message}>{message}</Text>}
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24, gap: 10 },
  eyebrow: { color: tokens.colors.gold, fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  title: { color: tokens.colors.text0, fontSize: 30, fontWeight: '800' },
  copy: { color: tokens.colors.text1, lineHeight: 21, marginBottom: 14 },
  card: { gap: 16 },
  input: { color: tokens.colors.text0, borderWidth: 1, borderColor: tokens.colors.line, borderRadius: 12, padding: 14, letterSpacing: 1 },
  message: { color: tokens.colors.text1, textAlign: 'center' },
});
