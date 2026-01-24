import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { theme } from '@/lib/theme';
import { useGameStore } from '@/stores/useGameStore';
import { mascots } from '@/data/mascots';
import { GlassCard } from '@/components/ui/GlassCard';
import MascotCard from '@/components/MascotCard';
import { PortalCard } from '@/components/home/PortalCard';
import { DailyMission } from '@/components/home/DailyMission';
import { FeaturedMascot } from '@/components/home/FeaturedMascot';
import { AnimatedIn } from '@/components/animations/AnimatedIn';
import { LootChestModal } from '@/components/LootChestModal';

const PORTALS = [
  {
    id: '1',
    title: 'Brand Portals',
    description: 'Explore 10 Casper brand universes',
    icon: '🌀',
    neonColor: 'purple' as const,
  },
  {
    id: '2',
    title: 'Trivia Challenge',
    description: 'Test your Casper knowledge',
    icon: '🎯',
    neonColor: 'blue' as const,
  },
];

const FEATURED_EPISODE = {
  id: '1',
  title: "Paddy's Quest for Flavor",
  description: 'Join Paddy Daddy Patty on an adventure through the Casper culinary universe',
  mascotName: 'Paddy Daddy',
  imageUrl: require('@/assets/mascots/PADDY DADDY PATTY DADDY MASCOT.png'),
  duration: '3:45',
};

const DAILY_MISSION = {
  id: '1',
  title: 'Daily Trivia',
  description: 'Which Casper brand features Paddy the mascot?',
  reward: 50,
  progress: 0,
  total: 1,
  icon: '🎯',
};

export default function HomeScreen() {
  const { points, streak, tier } = useGameStore();
  const [lootVisible, setLootVisible] = useState(false);
  const [lootRewards, setLootRewards] = useState<any[]>([]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#0a0a0a']}
        style={styles.bg}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <AnimatedIn delay={0}>
          <View style={styles.header}>
            <Text style={styles.title}>Casper Universe</Text>
            <View style={styles.stats}>
              <GlassCard neonColor="purple" style={styles.stat}>
                <Text style={styles.statLabel}>Points</Text>
                <Text style={styles.statValue}>{points}</Text>
              </GlassCard>
              <GlassCard neonColor="blue" style={styles.stat}>
                <Text style={styles.statLabel}>Streak</Text>
                <Text style={styles.statValue}>{streak}🔥</Text>
              </GlassCard>
              <GlassCard neonColor="green" style={styles.stat}>
                <Text style={styles.statLabel}>Tier</Text>
                <Text style={styles.statValue}>{tier}</Text>
              </GlassCard>
            </View>
          </View>
        </AnimatedIn>

        {/* Daily Mission */}
        <AnimatedIn delay={100}>
          <DailyMission
            mission={DAILY_MISSION}
            onPress={() => console.log('Daily mission pressed')}
          />
        </AnimatedIn>

        {/* Featured Mascot Episode */}
        <AnimatedIn delay={200}>
          <Text style={styles.sectionTitle}>Featured Episode</Text>
          <FeaturedMascot
            episode={FEATURED_EPISODE}
            onPress={() => console.log('Featured episode pressed')}
          />
        </AnimatedIn>

        {/* Portals */}
        <AnimatedIn delay={300}>
          <Text style={styles.sectionTitle}>Portals</Text>
        </AnimatedIn>
        {PORTALS.map((portal, index) => (
          <AnimatedIn key={portal.id} delay={400 + index * 100}>
            <PortalCard
              title={portal.title}
              description={portal.description}
              icon={portal.icon}
              neonColor={portal.neonColor}
              delay={0}
              onPress={() => console.log('Portal pressed:', portal.id)}
            />
          </AnimatedIn>
        ))}

        {/* Mascots */}
        <AnimatedIn delay={600}>
          <Text style={styles.sectionTitle}>Mascots</Text>
        </AnimatedIn>
        <View style={styles.mascotGrid}>
          {mascots.slice(0, 6).map((mascot, index) => (
            <AnimatedIn key={mascot.id} delay={700 + index * 50}>
              <MascotCard
                mascot={mascot}
                onPress={() => console.log('Mascot pressed:', mascot.id)}
              />
            </AnimatedIn>
          ))}
        </View>
      </ScrollView>

      {/* Loot Chest Modal */}
      <LootChestModal
        visible={lootVisible}
        rewards={lootRewards}
        onClose={() => setLootVisible(false)}
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
  scroll: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  stat: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    ...theme.typography.h2,
    color: theme.colors.accent,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  mascotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
});
