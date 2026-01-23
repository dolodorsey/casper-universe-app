import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../ui/GlassCard';
import { theme } from '../../lib/theme';

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  icon: string;
}

interface DailyMissionProps {
  mission: Mission;
  onPress: () => void;
}

export const DailyMission: React.FC<DailyMissionProps> = ({ mission, onPress }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: theme.animation.duration.slow,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: mission.progress / mission.total,
      duration: 1000,
      delay: 300,
      useNativeDriver: false,
    }).start();

    // Pulse animation for incomplete missions
    if (mission.progress < mission.total) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [mission.progress, mission.total]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const isCompleted = mission.progress >= mission.total;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable onPress={onPress}>
        <GlassCard neonColor="green" variant="default">
          <View style={styles.header}>
            <Text style={styles.label}>⚡ DAILY MISSION</Text>
            {isCompleted && <Text style={styles.completedBadge}>✓ COMPLETE</Text>}
          </View>

          <View style={styles.content}>
            <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.icon}>{mission.icon}</Text>
            </Animated.View>

            <View style={styles.details}>
              <Text style={styles.title}>{mission.title}</Text>
              <Text style={styles.description}>{mission.description}</Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      { width: progressWidth },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {mission.progress}/{mission.total}
                </Text>
              </View>

              <View style={styles.footer}>
                <View style={styles.rewardContainer}>
                  <Text style={styles.rewardIcon}>🏆</Text>
                  <Text style={styles.rewardText}>+{mission.reward} Points</Text>
                </View>
                {!isCompleted && (
                  <Text style={styles.actionText}>Complete Now →</Text>
                )}
              </View>
            </View>
          </View>

          {isCompleted && (
            <LinearGradient
              colors={[theme.colors.neonGreen, 'transparent']}
              style={styles.completedGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.neonGreen,
    letterSpacing: 1.5,
  },
  completedBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.neonGreen,
    backgroundColor: theme.colors.glassLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    letterSpacing: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: theme.spacing.md,
  },
  icon: {
    fontSize: 48,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.glassLight,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.neonGreen,
  },
  progressText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.glassLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.neonGreen,
  },
  rewardIcon: {
    fontSize: 16,
    marginRight: theme.spacing.xs,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.neonGreen,
  },
  actionText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.colors.neonGreen,
  },
  completedGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 120,
    height: 120,
    opacity: 0.15,
  },
});
