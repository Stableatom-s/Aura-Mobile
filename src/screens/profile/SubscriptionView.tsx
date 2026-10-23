import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Check, Star } from 'lucide-react-native';
import { BackHeader } from '@/components/common/BackHeader';
import { GradientButton } from '@/components/ui/GradientButton';

interface SubscriptionViewProps {
  onBack: () => void;
  isPremium: boolean;
}

const PERKS = [
  'Unlimited Gemini AI emotional dialogues',
  'Real-time voice check-in orb audio mode',
  'Automated multi-prompt daily journal reflections',
  'Complete 30-day and all-time mood trajectory analytics',
  'High-bitrate soothing meditation sessions',
];

export function SubscriptionView({ onBack, isPremium }: SubscriptionViewProps) {
  return (
    <View style={styles.container}>
      <BackHeader title="Aura Plus" onBack={onBack} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.badgeHeader}>
          <View style={styles.starCircle}>
            <Star size={24} color="#FBBF24" fill="#FBBF24" />
          </View>
          <Text style={styles.planTitle}>Aura Plus</Text>
          <Text style={styles.priceTag}>₹299 <Text style={styles.period}>/ month</Text></Text>
          <Text style={styles.subtext}>Cancel or adjust your membership anytime.</Text>
        </View>

        <View style={styles.perksCard}>
          <Text style={styles.perksHeader}>WHAT'S INCLUDED</Text>
          {PERKS.map((p, idx) => (
            <View key={idx} style={styles.perkRow}>
              <View style={styles.checkIcon}>
                <Check size={14} color="#34D399" />
              </View>
              <Text style={styles.perkText}>{p}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>
            Subscriptions are managed centrally via your secure Aura account on web.
          </Text>
        </View>

        <GradientButton
          title={isPremium ? 'Manage Membership' : 'Upgrade on Aura Web'}
          onPress={() => {}}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  badgeHeader: { alignItems: 'center', marginVertical: 20 },
  starCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(251,191,36,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  planTitle: { fontSize: 24, fontWeight: '800', color: '#F8FAFC' },
  priceTag: { fontSize: 32, fontWeight: '900', color: '#818CF8', marginTop: 4 },
  period: { fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  subtext: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 },
  perksCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 20,
  },
  perksHeader: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 16 },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  checkIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(52,211,153,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  perkText: { color: '#F8FAFC', fontSize: 13, flex: 1, lineHeight: 18 },
  infoBanner: {
    backgroundColor: 'rgba(129,140,248,0.1)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(129,140,248,0.2)',
  },
  infoText: { color: '#C4B5FD', fontSize: 12, textAlign: 'center', lineHeight: 18 },
});