import React, { useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../ui/GlassCard';
import { theme } from '../../lib/theme';

const { width } = Dimensions.get('window');

interface Episode {
  id: string;
  title: string;
  description: string;
  mascotName: string;
  imageUrl?: string;
  duration: string;
}

interface FeaturedMascotProps {
  episode: Episode;
}

export const FeaturedMascot: React.FC<FeaturedMascotProps> = ({ episode }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 15,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: theme.animation.duration.slow,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shimmer animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

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
      <GlassCard neonColor="pink" variant="gradient">
        <View style={styles.header}>
          <Text style={styles.label}>✨ FEATURED EPISODE</Text>
        </View>

        <Animated.View
          style={[
            styles.mascotContainer,
            { transform: [{ translateY }] },
          ]}
        >
          {episode.imageUrl ? (
            <Image
              source={{ uri: episode.imageUrl }}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.mascotEmoji}>👻</Text>
          )}
          
          <Animated.View
            style={[
              styles.shimmer,
              { opacity: shimmerOpacity },
            ]}
          />
        </Animated.View>

        <View style={styles.content}>
          <Text style={styles.mascotName}>{episode.mascotName}</Text>
          <Text style={styles.title}>{episode.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {episode.description}
          </Text>
          
          <View style={styles.footer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⏱ {episode.duration}</Text>
            </View>
            <Text style={styles.watchNow}>Watch Now →</Text>
          </View>
        </View>

        <LinearGradient
          colors={[theme.colors.neonPink, 'transparent']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </GlassCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.neonPink,
    letterSpacing: 2,
  },
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    position: 'relative',
  },
  mascotImage: {
    width: width * 0.5,
    height: 180,
  },
  mascotEmoji: {
    fontSize: 120,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.neonPink,
    borderRadius: theme.borderRadius.xl,
  },
  content: {
    marginTop: theme.spacing.md,
  },
  mascotName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: theme.colors.glassLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  badgeText: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: '600',
  },
  watchNow: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.neonPink,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 150,
    height: 150,
    opacity: 0.2,
  },
});
