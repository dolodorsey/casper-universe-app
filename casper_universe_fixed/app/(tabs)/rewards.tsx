import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/lib/theme';
import { useGameStore } from '@/stores/useGameStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedIn } from '@/components/animations/AnimatedIn';
import { REWARDS, type Reward } from '@/lib/rewards';

export default function RewardsScreen() {
  const { points, tier } = useGameStore();
  
  const getRewardStatus = (reward: Reward) => {
    if (points >= reward.pointsRequired) {
      return 'unlocked';
    } else if (tier >= reward.tierRequired) {
      return 'available';
    }
    return 'locked';
  };

  const renderReward = (reward: Reward, index: number) => {
    const status = getRewardStatus(reward);
    const isLocked = status === 'locked';
    
    return (
      <AnimatedIn key={reward.id} delay={index * 100}>
        <TouchableOpacity 
          style={styles.rewardCard}
          disabled={isLocked}
        >
          <GlassCard 
            neonColor={isLocked ? 'gray' : reward.rarity === 'legendary' ? 'purple' : reward.rarity === 'epic' ? 'blue' : 'green'}
            style={[styles.card, isLocked && styles.lockedCard]}
          >
            <View style={styles.rewardHeader}>
              <Text style={styles.rewardIcon}>{reward.icon}</Text>
              <View style={styles.rewardInfo}>
                <Text style={[styles.rewardName, isLocked && styles.lockedText]}>
                  {reward.name}
                </Text>
                <Text style={[styles.rewardDescription, isLocked && styles.lockedText]}>
                  {reward.description}
                </Text>
              </View>
            </View>
            
            <View style={styles.rewardFooter}>
              <View style={styles.requirement}>
                <Text style={[styles.requirementText, isLocked && styles.lockedText]}>
                  {isLocked ? '🔒' : '✅'} {reward.pointsRequired} points
                </Text>
                <Text style={[styles.requirementText, isLocked && styles.lockedText]}>
                  Tier {reward.tierRequired}+
                </Text>
              </View>
              
              {status === 'unlocked' && (
                <View style={styles.unlockedBadge}>
                  <Text style={styles.unlockedText}>UNLOCKED</Text>
                </View>
              )}
            </View>
          </GlassCard>
        </TouchableOpacity>
      </AnimatedIn>
    );
  };

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
            <Text style={styles.title}>Rewards Wallet</Text>
            <Text style={styles.subtitle}>Unlock perks as you progress</Text>
            
            <View style={styles.stats}>
              <GlassCard neonColor="purple" style={styles.stat}>
                <Text style={styles.statLabel}>Your Points</Text>
                <Text style={styles.statValue}>{points}</Text>
              </GlassCard>
              <GlassCard neonColor="blue" style={styles.stat}>
                <Text style={styles.statLabel}>Current Tier</Text>
                <Text style={styles.statValue}>{tier}</Text>
              </GlassCard>
            </View>
          </View>
        </AnimatedIn>

        {/* Rewards Grid */}
        <View style={styles.rewardsGrid}>
          {REWARDS.map((reward, index) => renderReward(reward, index))}
        </View>
      </ScrollView>
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
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
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
  rewardsGrid: {
    gap: theme.spacing.md,
  },
  rewardCard: {
    marginBottom: theme.spacing.md,
  },
  card: {
    padding: theme.spacing.md,
  },
  lockedCard: {
    opacity: 0.5,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  rewardIcon: {
    fontSize: 40,
    marginRight: theme.spacing.md,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  rewardDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  lockedText: {
    color: theme.colors.textSecondary,
    opacity: 0.6,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requirement: {
    gap: theme.spacing.xs,
  },
  requirementText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  unlockedBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  unlockedText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
});
