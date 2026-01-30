import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/lib/theme';
import { Mascot } from '@/data/mascots';
import { GlassCard } from '@/components/ui/GlassCard';

type Props = {
  mascot: Mascot;
  onPress: () => void;
};

export default function MascotCard({ mascot, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <GlassCard style={styles.card} neonColor="purple">
        <LinearGradient
          colors={['rgba(181,55,242,0.22)', 'rgba(0,0,0,0)']}
          style={styles.glow}
        />
        <View style={styles.content}>
          <Image source={mascot.image} style={styles.image} resizeMode="contain" />
          <Text style={styles.name}>{mascot.name}</Text>
          <Text style={styles.tag}>{mascot.slug}</Text>
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { width: '48%', marginBottom: theme.spacing.md },
  card: { padding: theme.spacing.md, aspectRatio: 0.75 },
  glow: { position: 'absolute', top: 0, left: 0, right: 0, height: '40%', borderRadius: theme.borderRadius.lg },
  content: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  image: { width: '100%', height: 120, marginBottom: theme.spacing.sm },
  name: { ...theme.typography.h3, color: theme.colors.text, textAlign: 'center' },
  tag: { ...theme.typography.caption, color: theme.colors.textSecondary, marginTop: theme.spacing.xs }
});
