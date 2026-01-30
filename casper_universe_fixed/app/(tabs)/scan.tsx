import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Camera, CameraView } from 'expo-camera';
import { theme } from '@/lib/theme';
import { useGameStore } from '@/stores/useGameStore';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { LootChestModal } from '@/components/LootChestModal';
import { generateLootDrop } from '@/lib/lootEngine';
import { AnimatedIn } from '@/components/animations/AnimatedIn';

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
      const totalPoints = rewards.filter(r => r.type === 'points').reduce((sum, r) => sum + (r.type === 'points' ? r.amount : 0), 0);
      
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
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#0a0a0a', '#1a1a2e', '#0a0a0a']}
          style={styles.bg}
        />
        <View style={styles.center}>
          <AnimatedIn delay={0}>
            <Text style={styles.title}>QR Scanner</Text>
            <Text style={styles.message}>Scan Casper Universe QR codes to unlock loot drops!</Text>
            <PrimaryButton
              title="Request Camera Permission"
              onPress={requestPermission}
              style={styles.button}
            />
          </AnimatedIn>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#0a0a0a', '#1a1a2e', '#0a0a0a']}
          style={styles.bg}
        />
        <View style={styles.center}>
          <AnimatedIn delay={0}>
            <Text style={styles.title}>🚫 Camera Access Denied</Text>
            <Text style={styles.message}>
              Please enable camera permissions in your device settings to scan QR codes.
            </Text>
          </AnimatedIn>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#0a0a0a']}
        style={styles.bg}
      />
      
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
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
    padding: theme.spacing.xl,
  },
  scanTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scanSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: theme.colors.accent,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
  },
  rescanButton: {
    marginTop: theme.spacing.xl,
  },
});
