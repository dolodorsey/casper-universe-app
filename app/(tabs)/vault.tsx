import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '@/components/ui/Screen';
import GlassCard from '@/components/ui/GlassCard';
import { type } from '@/lib/ui/type';
import { tokens } from '@/lib/ui/tokens';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useGameStore } from '@/stores/useGameStore';

type VaultRedemption = {
  id: string;
  reward_id: string | null;
  status: string | null;
  code: string | null;
  redeemed_at: string | null;
  meta: Record<string, unknown> | null;
  reward: {
    title: string;
    description: string | null;
    cost_points: number;
  } | null;
};

export default function VaultScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const points = useGameStore((s) => s.points);
  const streak = useGameStore((s) => s.streak);
  const syncFromServer = useGameStore((s) => s.syncFromServer);
  const [redemptions, setRedemptions] = useState<VaultRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadVault = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError('');
    try {
      if (!user?.id) {
        setRedemptions([]);
        return;
      }
      const { data, error: redemptionError } = await supabase
        .from('reward_redemptions')
        .select('id,reward_id,status,code,redeemed_at,meta,reward:rewards_catalog(title,description,cost_points)')
        .eq('user_id', user.id)
        .order('redeemed_at', { ascending: false });
      if (redemptionError) throw redemptionError;
      setRedemptions((data || []) as unknown as VaultRedemption[]);
      await syncFromServer();
    } catch (vaultError: any) {
      setError(vaultError?.message || 'Your vault could not be loaded.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [syncFromServer, user?.id]);

  useEffect(() => {
    void loadVault();
  }, [loadVault]);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={vstyles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadVault(true)} tintColor="#D4B87A" />}
      >
        <View style={{ gap: tokens.spacing.sm }}>
          <Text style={type.h1}>Vault</Text>
          <Text style={type.body}>Only issued rewards and earned account records live here.</Text>
        </View>

        <GlassCard>
          <Text style={vstyles.email}>{user?.email ?? 'guest'}</Text>
          <View style={vstyles.statsRow}>
            <View style={vstyles.statBlock}>
              <Text style={vstyles.statValue}>{points.toLocaleString()}</Text>
              <Text style={vstyles.statLabel}>POINTS</Text>
            </View>
            <View style={vstyles.statDivider} />
            <View style={vstyles.statBlock}>
              <Text style={vstyles.statValue}>{streak}</Text>
              <Text style={vstyles.statLabel}>STREAK</Text>
            </View>
            <View style={vstyles.statDivider} />
            <View style={vstyles.statBlock}>
              <Text style={vstyles.statValue}>{redemptions.length}</Text>
              <Text style={vstyles.statLabel}>ISSUED</Text>
            </View>
          </View>
          <Pressable onPress={signOut} style={vstyles.signOutBtn}>
            <Text style={vstyles.signOutText}>Sign out</Text>
          </Pressable>
        </GlassCard>

        {!!error && <View style={vstyles.errorBox}><Text style={vstyles.errorText}>{error}</Text></View>}

        <View style={vstyles.sectionHead}>
          <View>
            <Text style={vstyles.eyebrow}>ISSUED REWARDS</Text>
            <Text style={type.h2}>Your real inventory.</Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/rewards' as any)} style={vstyles.rewardsLink}>
            <Text style={vstyles.rewardsLinkText}>REWARDS →</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={vstyles.loading}><ActivityIndicator color="#D4B87A" /><Text style={vstyles.muted}>Loading issued records…</Text></View>
        ) : redemptions.length === 0 ? (
          <GlassCard glow>
            <Text style={vstyles.emptyTitle}>Your vault is empty.</Text>
            <Text style={vstyles.emptyBody}>That is intentional. Casper will not manufacture crates, badges or perks you have not actually earned. Redeem a live reward or scan a verified activation to create a real account record.</Text>
            <Pressable onPress={() => router.push('/(tabs)/rewards' as any)} style={vstyles.primaryBtn}>
              <Text style={vstyles.primaryText}>VIEW LIVE REWARDS</Text>
            </Pressable>
          </GlassCard>
        ) : (
          <View style={vstyles.list}>
            {redemptions.map((item) => (
              <GlassCard key={item.id} glow style={vstyles.rewardCard}>
                <View style={vstyles.rewardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={vstyles.rewardTitle}>{item.reward?.title || String(item.meta?.reward_title || 'Issued Casper reward')}</Text>
                    <Text style={vstyles.rewardBody}>{item.reward?.description || 'Verified Casper network reward.'}</Text>
                  </View>
                  <View style={vstyles.statusPill}><Text style={vstyles.statusText}>{(item.status || 'issued').toUpperCase()}</Text></View>
                </View>
                {item.code ? <View style={vstyles.codeRow}><Text style={vstyles.codeLabel}>REDEMPTION CODE</Text><Text selectable style={vstyles.code}>{item.code}</Text></View> : null}
                <View style={vstyles.metaRow}>
                  <Text style={vstyles.muted}>{item.reward?.cost_points ? `${item.reward.cost_points.toLocaleString()} points` : 'Account-issued reward'}</Text>
                  <Text style={vstyles.muted}>{item.redeemed_at ? new Date(item.redeemed_at).toLocaleDateString() : ''}</Text>
                </View>
              </GlassCard>
            ))}
          </View>
        )}

        <GlassCard style={vstyles.truthCard}>
          <Text style={vstyles.eyebrow}>VAULT TRUTH</Text>
          <Text style={vstyles.truthTitle}>No pretend loot.</Text>
          <Text style={vstyles.emptyBody}>Badges, drops and collection items will appear here only after their corresponding verified database records exist. Empty categories stay empty instead of being filled with demo content.</Text>
        </GlassCard>
      </ScrollView>
    </Screen>
  );
}

const vstyles = StyleSheet.create({
  content: { gap: 18, paddingBottom: 120 },
  email: { color: '#F5F0E8', fontSize: 14, marginBottom: 16 },
  statsRow: { flexDirection: 'row', marginVertical: 8 },
  statBlock: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(245,240,232,0.12)' },
  statValue: { color: '#D4B87A', fontSize: 25, fontWeight: '700' },
  statLabel: { color: 'rgba(245,240,232,0.55)', fontSize: 9, letterSpacing: 1.6, marginTop: 4 },
  signOutBtn: { marginTop: 16, paddingVertical: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(245,240,232,0.08)' },
  signOutText: { color: 'rgba(245,240,232,0.65)', fontSize: 13 },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  eyebrow: { color: '#D4B87A', fontSize: 9, fontWeight: '900', letterSpacing: 1.8 },
  rewardsLink: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(212,184,122,.3)' },
  rewardsLinkText: { color: '#D4B87A', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  loading: { minHeight: 160, alignItems: 'center', justifyContent: 'center', gap: 10 },
  list: { gap: 12 },
  rewardCard: { padding: 16 },
  rewardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  rewardTitle: { color: '#F5F0E8', fontSize: 17, fontWeight: '800' },
  rewardBody: { color: 'rgba(245,240,232,.56)', fontSize: 11, lineHeight: 17, marginTop: 5 },
  statusPill: { borderRadius: 999, backgroundColor: 'rgba(212,184,122,.12)', paddingHorizontal: 9, paddingVertical: 6 },
  statusText: { color: '#D4B87A', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  codeRow: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(245,240,232,.08)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  codeLabel: { color: 'rgba(245,240,232,.45)', fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },
  code: { color: '#D4B87A', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  metaRow: { marginTop: 11, flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  muted: { color: 'rgba(245,240,232,.48)', fontSize: 10 },
  emptyTitle: { color: '#F5F0E8', fontSize: 20, fontWeight: '800' },
  emptyBody: { color: 'rgba(245,240,232,.56)', fontSize: 12, lineHeight: 19, marginTop: 8 },
  primaryBtn: { marginTop: 18, borderRadius: 13, paddingVertical: 14, alignItems: 'center', backgroundColor: '#D4B87A' },
  primaryText: { color: '#0A090D', fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  errorBox: { borderRadius: 13, padding: 12, backgroundColor: 'rgba(220,60,60,.12)' },
  errorText: { color: '#FFB4B4', fontSize: 11, lineHeight: 17 },
  truthCard: { padding: 18, marginTop: 8 },
  truthTitle: { color: '#F5F0E8', fontSize: 18, fontWeight: '800', marginTop: 7 },
});
