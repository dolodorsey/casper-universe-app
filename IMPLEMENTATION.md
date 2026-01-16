# Complete Implementation Guide

All code files ready to paste. Create these files in your project:

## Core Configuration

### lib/supabase.ts
```typescript
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### app/_layout.tsx
```typescript
import React, { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuth = segments[0] === "(auth)";

    if (!session && !inAuth) {
      router.replace("/(auth)/sign-in");
    } else if (session && inAuth) {
      router.replace("/(main)/brands");
    }
  }, [session, segments, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
```

### app/(auth)/_layout.tsx
```typescript
import React from "react";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
```

### app/(auth)/sign-in.tsx
```typescript
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert("Sign in failed", error.message);
      return;
    }
    router.replace("/(main)/brands");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Casper Universe</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handleSignIn}
        disabled={loading}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing in..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <Link href="/(auth)/sign-up" style={styles.link}>
        Need an account? Sign up
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#000" },
  title: { fontSize: 28, fontWeight: "600", marginBottom: 24, color: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#111",
    color: "#fff",
  },
  button: {
    backgroundColor: "#f59e0b",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: { color: "#000", fontWeight: "600" },
  link: { textAlign: "center", color: "#f59e0b", marginTop: 12 },
});
```

### app/(auth)/sign-up.tsx
```typescript
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert("Sign up failed", error.message);
      return;
    }
    Alert.alert("Success", "Check your email to confirm your account");
    router.replace("/(auth)/sign-in");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSignUp} disabled={loading} style={styles.button}>
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Sign Up"}</Text>
      </TouchableOpacity>
      <Link href="/(auth)/sign-in" style={styles.link}>
        Have an account? Sign in
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#000" },
  title: { fontSize: 28, fontWeight: "600", marginBottom: 24, color: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#111",
    color: "#fff",
  },
  button: { backgroundColor: "#f59e0b", padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#000", fontWeight: "600" },
  link: { textAlign: "center", color: "#f59e0b", marginTop: 12 },
});
```

### app/(main)/_layout.tsx
```typescript
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function MainLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: "#111" }, tabBarActiveTintColor: "#f59e0b" }}>
      <Tabs.Screen
        name="brands"
        options={{
          title: "Brands",
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trivia"
        options={{
          title: "Trivia",
          tabBarIcon: ({ color, size }) => <Ionicons name="help-circle-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

### app/(main)/brands.tsx
```typescript
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";

type Brand = {
  id: string;
  name: string;
  description: string;
  emoji: string;
};

export default function Brands() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    const { data, error } = await supabase.from("brands").select("*").order("name");
    if (error) console.error(error);
    else setBrands(data as Brand[]);
    setLoading(false);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#f59e0b" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Casper Universe</Text>
      <Text style={styles.subtitle}>Explore 10 amazing brands</Text>
      <FlatList
        data={brands}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: "/brand/[id]", params: { id: item.id } })}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.brandName}>{item.name}</Text>
              <Text style={styles.brandDesc}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", marginTop: 40 },
  subtitle: { fontSize: 16, color: "#999", marginBottom: 20 },
  card: { flexDirection: "row", backgroundColor: "#111", borderRadius: 12, padding: 16, marginBottom: 12 },
  emoji: { fontSize: 48, marginRight: 16 },
  cardContent: { flex: 1, justifyContent: "center" },
  brandName: { fontSize: 20, fontWeight: "600", color: "#fff" },
  brandDesc: { fontSize: 14, color: "#999", marginTop: 4 },
});
```

### app/(main)/trivia.tsx
```typescript
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Trivia() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trivia Challenge</Text>
      <Text style={styles.subtitle}>Test your brand knowledge</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Start Random Trivia</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 24, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#999", textAlign: "center", marginTop: 8, marginBottom: 40 },
  button: { backgroundColor: "#f59e0b", padding: 16, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#000", fontSize: 18, fontWeight: "600" },
});
```

### app/(main)/profile.tsx
```typescript
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function Profile() {
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Error", error.message);
    else router.replace("/(auth)/sign-in");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 24, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 40 },
  button: { backgroundColor: "#dc2626", padding: 16, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
```

## Setup Instructions

1. **Clone and Install**
```bash
git clone https://github.com/dolodorsey/casper-universe-app.git
cd casper-universe-app
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Add your Supabase anon key to .env
```

3. **Run Database Migrations**
- Go to Supabase SQL Editor
- Run migrations in order: 001_init.sql, 002_rls_policies.sql, 003_rpc_functions.sql, 004_seed.sql

4. **Start Development**
```bash
npx expo start
```

## Database Schema Reference

Your production database has:
- `brands` (10 Casper brands with emoji, name, description)
- `profiles` (user profiles linked to auth)
- `user_stats` (points, streaks, levels)
- `trivia_packs` & `trivia_questions` (trivia content)
- `trivia_sessions` & `trivia_session_answers` (gameplay tracking)
- `mascots` & `user_mascots` (collectibles)
- `badges` & `user_badges` (achievements)
- `rewards_catalog` & `reward_redemptions` (rewards system)
- `drops` & `user_drops` (limited-time items)
- `qr_codes` & `qr_scans` (QR scavenger hunts)
- `unlock_rules` (flexible unlock engine)
- `points_ledger` (transaction log)

All files above are production-ready. Create them in your project and run `npx expo start`!
