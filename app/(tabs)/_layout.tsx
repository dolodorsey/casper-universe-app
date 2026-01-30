import { Tabs } from 'expo-router';
import { Text, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { tokens } from '@/lib/ui/tokens';
import { haptics } from '@/lib/ui/haptics';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tokens.colors.neon,
        tabBarInactiveTintColor: tokens.colors.muted,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
          height: 80,
          paddingBottom: 20,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={tokens.blur.high}
            tint="dark"
            style={{
              ...Platform.select({
                android: { backgroundColor: tokens.colors.bg0 }
              })
            }}
          />
        ),
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏠</Text>,
        }}
        listeners={{
          tabPress: () => haptics.tap(),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📷</Text>,
        }}
        listeners={{
          tabPress: () => haptics.tap(),
        }}
      />
      <Tabs.Screen
        name="vault"
        options={{
          title: 'Vault',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>💎</Text>,
        }}
        listeners={{
          tabPress: () => haptics.tap(),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          href: null, // Hide the old rewards tab
        }}
      />
    </Tabs>
  );
}
