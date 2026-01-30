import 'react-native-gesture-handler';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { UniverseBackground } from '../components/ui/UniverseBackground';
import { View, StyleSheet } from 'react-native';
import { theme } from '../lib/theme';

export default function RootLayout() {
    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar style="light" />
            <UniverseBackground>
                <Stack screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'transparent' }
                }}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </UniverseBackground>
        </View>
    );
}
