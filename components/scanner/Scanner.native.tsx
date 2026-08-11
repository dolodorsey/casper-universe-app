import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import Screen from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { AnimatedIn } from '@/components/animations/AnimatedIn';
import { supabase } from '@/lib/supabase';
import { useGameStore } from '@/stores/useGameStore';
import { type } from '@/lib/ui/type';
import { tokens } from '@/lib/ui/tokens';

type RedeemQrResult = {
  success?: boolean;
  error?: string;
  points_earned?: number;
  brand_id?: string;
};

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const syncFromServer = useGameStore((state) => state.syncFromServer);

  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
    if (scanned || busy) return;

    const token = data.trim();
    setScanned(true);
    setBusy(true);
    setMessage('Verifying activation…');

    try {
      if (!token) throw new Error('This QR code does not contain a valid Casper activation token.');

      const { data: resultData, error } = await supabase.rpc('redeem_qr_token', { p_token: token });
      if (error) throw error;

      const result = (resultData || {}) as RedeemQrResult;
      if (!result.success) throw new Error(result.error || 'This code could not be redeemed.');

      await syncFromServer();
      const points = Number(result.points_earned || 0);
      const brand = result.brand_id ? ` for ${result.brand_id.replaceAll('_', ' ')}` : '';
      setMessage(`Verified${brand}: +${points.toLocaleString()} points`);
      Alert.alert('Casper activation verified', `+${points.toLocaleString()} points were added to your account.`, [
        { text: 'Done' },
      ]);
    } catch (redeemError: any) {
      const errorMessage = redeemError?.message || 'Reward verification is temporarily unavailable. Please try again.';
      setMessage(errorMessage);
      Alert.alert('Activation not completed', errorMessage, [
        { text: 'Scan again', onPress: () => setScanned(false) },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const resetScanner = () => {
    setMessage('');
    setScanned(false);
  };

  if (hasPermission === null) {
    return (
      <Screen>
        <View style={styles.center}>
          <AnimatedIn delay={0}>
            <Text style={type.h1}>QR Scanner</Text>
            <Text style={[type.body, styles.centerCopy]}>
              Scan verified Casper Universe QR codes to redeem activation points.
            </Text>
            <PrimaryButton
              title="Request Camera Permission"
              onPress={requestPermission}
              style={styles.button}
            />
          </AnimatedIn>
        </View>
      </Screen>
    );
  }

  if (hasPermission === false) {
    return (
      <Screen>
        <View style={styles.center}>
          <AnimatedIn delay={0}>
            <Text style={type.h1}>Camera Access Required</Text>
            <Text style={[type.body, styles.centerCopy]}>
              Enable camera access in your device settings to scan Casper activation codes.
            </Text>
          </AnimatedIn>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false} contentStyle={{ padding: 0 }}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned || busy ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />

        <View style={styles.overlay}>
          <AnimatedIn delay={0}>
            <Text style={styles.scanTitle}>Scan QR Code</Text>
            <Text style={styles.scanSubtitle}>Point the camera at a verified Casper activation code.</Text>
          </AnimatedIn>

          <View style={styles.scanFrame} />

          {busy ? (
            <View style={styles.statusBox}>
              <ActivityIndicator color={tokens.colors.gold} />
              <Text style={styles.statusText}>{message || 'Verifying activation…'}</Text>
            </View>
          ) : message ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>{message}</Text>
            </View>
          ) : null}

          {scanned && !busy && (
            <AnimatedIn delay={150}>
              <PrimaryButton title="Scan Another Code" onPress={resetScanner} style={styles.rescanButton} />
            </AnimatedIn>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
  },
  centerCopy: {
    textAlign: 'center',
    marginVertical: tokens.spacing.md,
  },
  button: {
    minWidth: 200,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scanTitle: {
    ...type.h2,
    color: tokens.colors.text0,
    marginBottom: tokens.spacing.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scanSubtitle: {
    ...type.body,
    fontWeight: 'normal',
    color: tokens.colors.text1,
    marginBottom: tokens.spacing.xl,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: tokens.colors.neon,
    borderRadius: tokens.radius.lg,
    backgroundColor: 'rgba(109, 255, 184, 0.1)',
  },
  statusBox: {
    marginTop: tokens.spacing.lg,
    minWidth: 240,
    maxWidth: 340,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    backgroundColor: 'rgba(10,10,16,.82)',
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  statusText: {
    ...type.body,
    color: tokens.colors.text0,
    textAlign: 'center',
  },
  rescanButton: {
    marginTop: tokens.spacing.lg,
  },
});
