import { View, Text, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { Camera, CameraView } from 'expo-camera';
import Screen from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { LootChestModal } from '@/components/LootChestModal';
import { generateLootDrop } from '@/lib/lootEngine';
import { AnimatedIn } from '@/components/animations/AnimatedIn';
import { useGameStore } from '@/stores/useGameStore';
import { type } from '@/lib/ui/type';
import { tokens } from '@/lib/ui/tokens';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [lootVisible, setLootVisible] = useState(false);
  const [lootRewards, setLootRewards] = useState<any[]>([]);
  const { addPoints, tier } = useGameStore();

  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;

    setScanned(true);

    // Check if it's a valid Casper Universe QR code
    if (data.includes('casper-universe') || data.includes('loot-drop')) {
      // Generate loot drop
      const rewards = generateLootDrop(tier);
      const totalPoints = rewards.reduce((sum, r) => sum + r.points, 0);

      addPoints(totalPoints);
      setLootRewards(rewards);
      setLootVisible(true);
    } else {
      Alert.alert(
        'Invalid QR Code',
        'This is not a Casper Universe loot drop QR code.',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    }
  };

  const handleLootClose = () => {
    setLootVisible(false);
    setScanned(false);
  };

  if (hasPermission === null) {
    return (
      <Screen>
        <View style={styles.center}>
          <AnimatedIn delay={0}>
            <Text style={type.h1}>QR Scanner</Text>
            <Text style={[type.body, { textAlign: 'center', marginVertical: tokens.spacing.md }]}>
              Scan Casper Universe QR codes to unlock loot drops!
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
            <Text style={type.h1}>🚫 Camera Access Denied</Text>
            <Text style={[type.body, { textAlign: 'center', marginVertical: tokens.spacing.md }]}>
              Please enable camera permissions in your device settings to scan QR codes.
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
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />

        <View style={styles.overlay}>
          <AnimatedIn delay={0}>
            <Text style={styles.scanTitle}>Scan QR Code</Text>
            <Text style={styles.scanSubtitle}>Position the QR code within the frame</Text>
          </AnimatedIn>

          <View style={styles.scanFrame} />

          {scanned && (
            <AnimatedIn delay={200}>
              <PrimaryButton
                title="Tap to Scan Again"
                onPress={() => setScanned(false)}
                style={styles.rescanButton}
              />
            </AnimatedIn>
          )}
        </View>
      </View>

      <LootChestModal
        visible={lootVisible}
        rewards={lootRewards}
        onClose={handleLootClose}
      />
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
  rescanButton: {
    marginTop: tokens.spacing.xl,
  },
});
