import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { PortalCard, FeaturedMascot, DailyMission } from '../components/home';
import { theme } from '../lib/theme';

// Sample data
const PORTALS = [
  {
    id: '1',
    title: 'Explore Brands',
    description: 'Discover 10 amazing Casper brands',
    icon: '🏢',
    neonColor: 'blue' as const,
  },
  {
    id: '2',
    title: 'Play Trivia',
    description: 'Test your brand knowledge',
    icon: '🎯',
    neonColor: 'purple' as const,
  },
  {
    id: '3',
    title: 'Collect Mascots',
    description: 'Unlock unique characters',
    icon: '👻',
    neonColor: 'pink' as const,
  },
  {
    id: '4',
    title: 'Scan QR Codes',
    description: 'Find hidden treasures',
    icon: '📱',
    neonColor: 'green' as const,
  },
];

const FEATURED_EPISODE = {
  id: 'ep1',
  title: 'The Ghost King Returns',
  description: 'Join Casper on an epic adventure through the spirit realm as he discovers his true powers.',
  mascotName: 'Casper',
  duration: '12:30',
};

const DAILY_MISSION = {
  id: 'mission1',
  title: 'Answer 5 Trivia Questions',
  description: 'Test your knowledge across different brands',
  reward: 100,
  progress: 3,
  total: 5,
  icon: '🎮',
};

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Your Casper Universe awaits</Text>
        </View>

        {/* Featured Mascot Episode */}
        <FeaturedMascot episode={FEATURED_EPISODE} />

        {/* Daily Mission */}
        <DailyMission
          mission={DAILY_MISSION}
          onPress={() => console.log('Navigate to trivia')}
        />

        {/* Portals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌟 Explore Universe</Text>
          
          {PORTALS.map((portal, index) => (
            <PortalCard
              key={portal.id}
              title={portal.title}
              description={portal.description}
              icon={portal.icon}
              neonColor={portal.neonColor}
              delay={index * 100}
              onPress={() => console.log(`Navigate to ${portal.title}`)}
            />
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  bottomSpacing: {
    height: theme.spacing.xxl,
  },
});
