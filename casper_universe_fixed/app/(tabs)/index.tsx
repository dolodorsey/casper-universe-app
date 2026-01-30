import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { theme } from '@/lib/theme';
import { mascots } from '@/data/mascots';
import { useGameStore } from '@/stores/useGameStore';
import { AnimatedIn } from '@/components/animations/AnimatedIn';
import { LootChestModal } from '@/components/LootChestModal';
import { FeaturedMascot, PortalCard, DailyMission } from '@/components/home';

type Portal = {
  title: string;
  subtitle: string;
  icon: string;
  progress: number;
  color: 'blue' | 'purple' | 'pink' | 'green';
  route: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const { points, tier, streak, lastLoot, setLastLoot } = useGameStore();

  const portals: Portal[] = [
    {
      title: 'SCAN & EARN',
      subtitle: 'Scan QR codes in-store to unlock loot.',
      icon: '📷',
      progress: Math.min(points / 500, 1),
      color: 'green',
      route: '/(tabs)/scan',
    },
    {
      title: 'REWARDS VAULT',
      subtitle: 'Spend points on perks and drops.',
      icon: '🎁',
      progress: Math.min(points / 1500, 1),
      color: 'purple',
      route: '/(tabs)/rewards',
    },
  ];

  const featured = mascots[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient colors={[theme.colors.bg, '#0F0F1A']} style={styles.bg} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AnimatedIn>
          <Text style={styles.kicker}>CASPER UNIVERSE</Text>
          <Text style={styles.title}>Your Brand Worlds.</Text>
          <Text style={styles.subtitle}>
            Tier {tier} • {points} Power Points • {streak} day streak
          </Text>
        </AnimatedIn>

        <View style={{ marginTop: theme.spacing.lg }}>
          <FeaturedMascot mascot={featured} onPress={() => {}} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>PORTALS</Text>
          <Text style={styles.sectionHint}>Do actions. Unlock drops.</Text>
        </View>

        <View style={{ gap: theme.spacing.md }}>
          {portals.map((p, idx) => (
            <AnimatedIn key={p.title} delay={idx * 80}>
              <PortalCard
                title={p.title}
                subtitle={p.subtitle}
                icon={p.icon}
                progress={p.progress}
                color={p.color}
                onPress={() => router.push(p.route as any)}
              />
            </AnimatedIn>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>DAILY MISSION</Text>
          <Text style={styles.sectionHint}>Keep the streak alive.</Text>
        </View>

        <DailyMission
          title="Scan 1 QR code"
          subtitle="Any Casper Group location counts."
          progress={Math.min(streak / 7, 1)}
          onPress={() => router.push('/(tabs)/scan' as any)}
        />

        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>

      <LootChestModal visible={!!lastLoot} rewards={lastLoot ?? []} onClose={() => setLastLoot(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  bg: { ...StyleSheet.absoluteFillObject },
  content: { padding: theme.spacing.lg },
  kicker: {
    color: theme.gold,
    fontWeight: '900',
    letterSpacing: 3,
    fontSize: 10,
    marginBottom: 8,
  },
  title: { ...theme.typography.h1, color: theme.colors.text },
  subtitle: { ...theme.typography.body, color: theme.colors.textSecondary, marginTop: 10 },
  sectionHeader: { marginTop: theme.spacing.xl, marginBottom: theme.spacing.md },
  sectionTitle: { ...theme.typography.h3, color: theme.colors.text },
  sectionHint: { ...theme.typography.caption, color: theme.colors.textSecondary, marginTop: 4 },
});
