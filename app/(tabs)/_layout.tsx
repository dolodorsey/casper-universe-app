import { Tabs } from 'expo-router';
import { theme } from '@/lib/theme';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.cardBg,
          borderTopColor: 'rgba(138, 43, 226, 0.2)',
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: theme.colors.bg,
          borderBottomColor: 'rgba(138, 43, 226, 0.2)',
          borderBottomWidth: 1,
        },
        headerTintColor: theme.colors.text,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📷</Text>,
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🎁</Text>,
        }}
      />
    </Tabs>
  );
}
