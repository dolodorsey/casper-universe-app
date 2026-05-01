import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuth } from '@/lib/auth';
import { theme } from '@/lib/theme';

/**
 * Casper Universe — Auth screen.
 *
 * Two-step OTP flow:
 *  Step 1: Enter email → request OTP
 *  Step 2: Enter 6-digit code from email → verify → app routes to (tabs)
 *
 * No password. No account creation form. Whoever enters a code wins.
 */

type Step = 'email' | 'otp';

export default function AuthScreen() {
  const { signInWithEmail, verifyOtp } = useAuth();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const handleSendCode = async () => {
    setError(null);
    setBusy(true);
    const { error } = await signInWithEmail(email);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    setStep('otp');
    setInfo(`Code sent to ${email.toLowerCase()}. Check your inbox (and spam folder).`);
  };

  const handleVerify = async () => {
    setError(null);
    setBusy(true);
    const { error } = await verifyOtp(email, otp);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    // Success: AuthProvider's session listener will route the app to (tabs).
  };

  const handleBack = () => {
    setStep('email');
    setOtp('');
    setError(null);
    setInfo(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand mark */}
        <View style={styles.header}>
          <Text style={styles.logo}>CASPER</Text>
          <Text style={styles.subLogo}>UNIVERSE</Text>
        </View>

        {/* Headline */}
        <View style={styles.headline}>
          <Text style={styles.h1}>
            {step === 'email' ? 'Enter the universe.' : 'Check your inbox.'}
          </Text>
          <Text style={styles.lede}>
            {step === 'email'
              ? 'Sign in or create your account with just an email — no password.'
              : `We sent a 6-digit code to ${email.toLowerCase()}. Enter it below.`}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {step === 'email' ? (
            <>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="rgba(245,240,232,0.35)"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="send"
                value={email}
                onChangeText={setEmail}
                onSubmitEditing={handleSendCode}
                editable={!busy}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                  busy && styles.buttonDisabled,
                ]}
                onPress={handleSendCode}
                disabled={busy || !email.trim()}
              >
                {busy ? (
                  <ActivityIndicator color="#080604" />
                ) : (
                  <Text style={styles.buttonText}>Send Code</Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.label}>6-DIGIT CODE</Text>
              <TextInput
                style={[styles.input, styles.otpInput]}
                placeholder="000000"
                placeholderTextColor="rgba(245,240,232,0.25)"
                keyboardType="number-pad"
                maxLength={6}
                returnKeyType="go"
                value={otp}
                onChangeText={(v) => setOtp(v.replace(/\D/g, ''))}
                onSubmitEditing={handleVerify}
                editable={!busy}
                autoFocus
              />

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                  busy && styles.buttonDisabled,
                ]}
                onPress={handleVerify}
                disabled={busy || otp.length !== 6}
              >
                {busy ? (
                  <ActivityIndicator color="#080604" />
                ) : (
                  <Text style={styles.buttonText}>Verify & Continue</Text>
                )}
              </Pressable>

              <Pressable onPress={handleBack} disabled={busy} style={styles.linkRow}>
                <Text style={styles.link}>Use a different email</Text>
              </Pressable>
            </>
          )}

          {info && !error && <Text style={styles.info}>{info}</Text>}
          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          By continuing, you agree to the Casper Universe Terms of Service.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 56,
  },
  logo: {
    color: '#F5F0E8',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 8,
  },
  subLogo: {
    color: 'rgba(245,240,232,0.55)',
    fontSize: 11,
    letterSpacing: 6,
    marginTop: 4,
  },
  headline: {
    marginBottom: 40,
  },
  h1: {
    color: '#F5F0E8',
    fontSize: 32,
    fontWeight: '300',
    fontStyle: 'italic',
    lineHeight: 38,
    marginBottom: 12,
  },
  lede: {
    color: 'rgba(245,240,232,0.65)',
    fontSize: 15,
    lineHeight: 22,
  },
  form: { gap: 16, marginBottom: 32 },
  label: {
    color: 'rgba(245,240,232,0.55)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: -8,
  },
  input: {
    backgroundColor: 'rgba(245,240,232,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(245,240,232,0.12)',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: '#F5F0E8',
    fontSize: 16,
  },
  otpInput: {
    fontSize: 28,
    letterSpacing: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#D4B87A',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    color: '#080604',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  linkRow: { alignItems: 'center', paddingVertical: 12 },
  link: {
    color: 'rgba(245,240,232,0.55)',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  info: {
    color: 'rgba(212,184,122,0.85)',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
  },
  error: {
    color: '#FF6B6B',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
  },
  footer: {
    color: 'rgba(245,240,232,0.35)',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 24,
  },
});
