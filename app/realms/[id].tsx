import React from 'react';
import { Text } from 'react-native';
import Screen from '@/components/ui/Screen';
import { useLocalSearchParams } from 'expo-router';
import { REALMS } from '@/data/realms';
import { type } from '@/lib/ui/type';

export default function RealmDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const realm = REALMS.find(r => r.id === id) ?? REALMS[0];

    return (
        <Screen variant="realm" accent={realm.accent}>
            <Text style={type.h1}>{realm.name}</Text>
            <Text style={type.body}>{realm.tagline}</Text>
            <Text style={type.caption}>Build: realm missions + realm rewards next.</Text>
        </Screen>
    );
}
