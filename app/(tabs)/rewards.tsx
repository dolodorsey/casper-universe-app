import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/lib/theme';
import { useGameStore } from '@/stores/useGameStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedIn } from '@/components/animations/AnimatedIn';
import { supabase } from '@/lib/supabase';

type CatalogReward = {
  id: string;
  brand_id: string | null;
  title: string;
  description: string | null;
  cost_points: number;
  inventory_limit: number | null;
  image_url: string | null;
  is_active: boolean | null;
};

type Redemption = {
  id: string;
  reward_id: string | null;
  status: string | null;
  code: string | null;
  redeemed_at: string | null;
  meta: Record<string, unknown> | null;
};

type RedeemResult = {
  success?: boolean;
  error?: string;
  redemption_id?: string;
  reward_title?: string;
  points_spent?: number;
  points_remaining?: number;
  code?: string;
  status?: string;
};

export default function RewardsScreen() {
  const { points, syncFromServer } = useGameStore();
  const [rewards, setRewards] = useState<CatalogReward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyReward, setBusyReward] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError('');
    try {
      const [{ data: catalog, error: catalogError }, { data: { user } }] = await Promise.all([
        supabase
          .from('rewards_catalog')
          .select('id,brand_id,title,description,cost_points,inventory_limit,image_url,is_active')
          .eq('is_active', true)
          .order('cost_points', { ascending: true })
          .order('title', { ascending: true }),
        supabase.auth.getUser(),
      ]);
      if (catalogError) throw catalogError;
      setRewards((catalog || []) as CatalogReward[]);

      if (user) {
        const { data: issued, error: redemptionError } = await supabase
          .from('reward_redemptions')
          .select('id,reward_id,status,code,redeemed_at,meta')
          .eq('user_id', user.id)
          .order('redeemed_at', { ascending: false })
          .limit(30);
        if (redemptionError) throw redemptionError;
        setRedemptions((issued || []) as Redemption[]);
      } else {
        setRedemptions([]);
      }
      await syncFromServer();
    } catch (loadError: any) {
      setError(loadError?.message || 'Rewards are temporarily unavailable.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [syncFromServer]);

  useEffect(() => {
    void load();
  }, [load]);

  const redemptionByReward = useMemo(() => {
    const map = new Map<string, Redemption>();
    for (const redemption of redemptions) {
      if (redemption.reward_id && !map.has(redemption.reward_id)) map.set(redemption.reward_id, redemption);
    }
    return map;
  }, [redemptions]);

  const redeem = async (reward: CatalogReward) => {
    if (busyReward) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Sign in required', 'Sign in to your Casper account before redeeming a reward.');
      return;
    }
    if (points < reward.cost_points) {
      Alert.alert('More points needed', `You need ${reward.cost_points.toLocaleString()} points for ${reward.title}.`);
      return;
    }

    Alert.alert(
      'Redeem reward?',
      `${reward.title} costs ${reward.cost_points.toLocaleString()} points. This deduction is final once the reward is issued.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: async () => {
            setBusyReward(reward.id);
            setError('');
            try {
              const { data, error: redeemError } = await supabase.rpc('redeem_reward', { p_reward_id: reward.id });
              if (redeemError) throw redeemError;
              const result = (data || {}) as RedeemResult;
              if (!result.success) throw new Error(result.error || 'This reward could not be redeemed.');
              await syncFromServer();
              await load(true);
              Alert.alert(
                'Reward issued',
                `${result.reward_title || reward.title}\n\nCode: ${result.code || 'Issued in your wallet'}\n\n${Number(result.points_spent || reward.cost_points).toLocaleString()} points redeemed.`,
              );
            } catch (redeemFailure: any) {
              const message = redeemFailure?.message || 'Reward redemption is temporarily unavailable.';
              setError(message);
              Alert.alert('Redemption not completed', message);
            } finally {
              setBusyReward(null);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={theme.colors.accent} />}
      >
        <AnimatedIn delay={0}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>LIVE REWARDS CATALOG</Text>
            <Text style={styles.title}>Rewards Wallet</Text>
            <Text style={styles.subtitle}>Redeem only what the Casper network is actually offering right now.</Text>
            <View style={styles.stats}>
              <GlassCard neonColor="purple" style={styles.stat}>
                <Text style={styles.statLabel}>Available Points</Text>
                <Text style={styles.statValue}>{points.toLocaleString()}</Text>
              </GlassCard>
              <GlassCard neonColor="blue" style={styles.stat}>
                <Text style={styles.statLabel}>Issued Rewards</Text>
                <Text style={styles.statValue}>{redemptions.length}</Text>
              </GlassCard>
            </View>
          </View>
        </AnimatedIn>

        {!!error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

        {loading ? (
          <View style={styles.loading}><ActivityIndicator size="large" color={theme.colors.accent} /><Text style={styles.loadingText}>Loading live rewards…</Text></View>
        ) : rewards.length === 0 ? (
          <GlassCard style={styles.emptyCard}><Text style={styles.emptyTitle}>No rewards are active right now.</Text><Text style={styles.emptyBody}>Your points stay in your account until a verified reward is published.</Text></GlassCard>
        ) : (
          <View style={styles.rewardsGrid}>
            {rewards.map((reward, index) => {
              const affordable = points >= reward.cost_points;
              const recentRedemption = redemptionByReward.get(reward.id);
              const busy = busyReward === reward.id;
              return (
                <AnimatedIn key={reward.id} delay={Math.min(index * 70, 420)}>
                  <TouchableOpacity
                    style={styles.rewardCard}
                    activeOpacity={0.82}
                    disabled={busy || !affordable}
                    onPress={() => void redeem(reward)}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: busy || !affordable }}
                    accessibilityLabel={`${reward.title}, ${reward.cost_points} points`}
                  >
                    <GlassCard neonColor={affordable ? 'green' : 'gray'} style={[styles.card, !affordable && styles.lockedCard]}>
                      <View style={styles.rewardHeader}>
                        <View style={styles.rewardIcon}><Text style={styles.rewardIconText}>{reward.brand_id ? '✦' : '◇'}</Text></View>
                        <View style={styles.rewardInfo}>
                          <Text style={styles.rewardName}>{reward.title}</Text>
                          <Text style={styles.rewardDescription}>{reward.description || 'Verified Casper network reward.'}</Text>
                          {!!reward.brand_id && <Text style={styles.brandLabel}>{reward.brand_id.replaceAll('_', ' ').toUpperCase()}</Text>}
                        </View>
                      </View>

                      <View style={styles.rewardFooter}>
                        <View>
                          <Text style={styles.cost}>{reward.cost_points.toLocaleString()} points</Text>
                          <Text style={styles.availability}>{affordable ? 'READY TO REDEEM' : `${(reward.cost_points - points).toLocaleString()} MORE NEEDED`}</Text>
                        </View>
                        <View style={[styles.actionBadge, affordable ? styles.actionReady : styles.actionLocked]}>
                          {busy ? <ActivityIndicator size="small" color={affordable ? '#07120B' : '#A8A8B3'} /> : <Text style={[styles.actionText, !affordable && styles.actionTextLocked]}>{affordable ? 'REDEEM' : 'LOCKED'}</Text>}
                        </View>
                      </View>

                      {recentRedemption?.code ? (
                        <View style={styles.issuedRow}>
                          <Text style={styles.issuedLabel}>LATEST ISSUED CODE</Text>
                          <Text selectable style={styles.issuedCode}>{recentRedemption.code}</Text>
                        </View>
                      ) : null}
                    </GlassCard>
                  </TouchableOpacity>
                </AnimatedIn>
              );
            })}
          </View>
        )}

        <View style={styles.truthCard}>
          <Text style={styles.truthTitle}>Server-authoritative redemption</Text>
          <Text style={styles.truthBody}>Casper checks your signed-in account, available points and live reward inventory before deducting anything. If the transaction fails, your points are not spent.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: theme.spacing.lg, paddingBottom: 120 },
  header: { marginBottom: theme.spacing.xl },
  eyebrow: { color: theme.colors.accent, fontSize: 10, fontWeight: '900', letterSpacing: 2, textAlign: 'center', marginBottom: 8 },
  title: { ...theme.typography.h1, color: theme.colors.text, marginBottom: theme.spacing.xs, textAlign: 'center' },
  subtitle: { ...theme.typography.body, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: theme.spacing.lg, lineHeight: 21 },
  stats: { flexDirection: 'row', gap: theme.spacing.md },
  stat: { flex: 1, padding: theme.spacing.md, alignItems: 'center' },
  statLabel: { ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs, textAlign: 'center' },
  statValue: { ...theme.typography.h2, color: theme.colors.accent },
  errorBox: { marginBottom: 14, borderRadius: 14, padding: 12, backgroundColor: 'rgba(220,60,60,.12)', borderWidth: 1, borderColor: 'rgba(255,100,100,.22)' },
  errorText: { color: '#FFB3B3', fontSize: 12, lineHeight: 18, textAlign: 'center' },
  loading: { minHeight: 240, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: theme.colors.textSecondary, fontSize: 12 },
  emptyCard: { padding: 24, alignItems: 'center' },
  emptyTitle: { color: theme.colors.text, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  emptyBody: { color: theme.colors.textSecondary, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 8 },
  rewardsGrid: { gap: theme.spacing.md },
  rewardCard: { marginBottom: theme.spacing.md },
  card: { padding: theme.spacing.md },
  lockedCard: { opacity: 0.58 },
  rewardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: theme.spacing.md },
  rewardIcon: { width: 44, height: 44, borderRadius: 14, marginRight: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(212,184,122,.1)', borderWidth: 1, borderColor: 'rgba(212,184,122,.2)' },
  rewardIconText: { color: theme.colors.accent, fontSize: 22 },
  rewardInfo: { flex: 1 },
  rewardName: { ...theme.typography.h3, color: theme.colors.text, marginBottom: theme.spacing.xs },
  rewardDescription: { ...theme.typography.body, color: theme.colors.textSecondary, lineHeight: 19 },
  brandLabel: { color: theme.colors.accent, fontSize: 9, fontWeight: '900', letterSpacing: 1.4, marginTop: 8 },
  rewardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  cost: { color: theme.colors.text, fontSize: 14, fontWeight: '900' },
  availability: { color: theme.colors.textSecondary, fontSize: 9, fontWeight: '800', letterSpacing: 1.1, marginTop: 4 },
  actionBadge: { minWidth: 88, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  actionReady: { backgroundColor: theme.colors.success },
  actionLocked: { backgroundColor: 'rgba(255,255,255,.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,.1)' },
  actionText: { color: '#07120B', fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  actionTextLocked: { color: theme.colors.textSecondary },
  issuedRow: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.08)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  issuedLabel: { color: theme.colors.textSecondary, fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },
  issuedCode: { color: theme.colors.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  truthCard: { marginTop: 22, padding: 18, borderRadius: 18, backgroundColor: 'rgba(255,255,255,.035)', borderWidth: 1, borderColor: 'rgba(255,255,255,.07)' },
  truthTitle: { color: theme.colors.text, fontSize: 14, fontWeight: '800' },
  truthBody: { color: theme.colors.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 7 },
});
