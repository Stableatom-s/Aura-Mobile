import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Check, Star } from 'lucide-react-native';
import { BackHeader } from '@/components/common/BackHeader';
import { GradientButton } from '@/components/ui/GradientButton';
import { useAppTheme } from '@/context/ThemeContext';

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
  const { colors, fonts, accentColor } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BackHeader title="Aura Plus" onBack={onBack} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.badgeHeader}>
          <View style={styles.starCircle}>
            <Star size={24} color="#FBBF24" fill="#FBBF24" />
          </View>
          <Text style={[styles.planTitle, { fontSize: fonts.header, color: colors.textPrimary }]}>
            Aura Plus
          </Text>
          <Text style={[styles.priceTag, { color: accentColor }]}>
            ₹299{' '}
            <Text style={[styles.period, { fontSize: fonts.body, color: colors.textMuted }]}>
              / month
            </Text>
          </Text>
          <Text style={[styles.subtext, { fontSize: fonts.caption, color: colors.textSecondary }]}>
            Cancel or adjust your membership anytime.
          </Text>
        </View>

        <View style={[styles.perksCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.perksHeader, { fontSize: fonts.caption, color: colors.textMuted }]}>
            WHAT'S INCLUDED
          </Text>
          {PERKS.map((p, idx) => (
            <View key={idx} style={styles.perkRow}>
              <View style={[styles.checkIcon, { backgroundColor: `${accentColor}20` }]}>
                <Check size={14} color={accentColor} />
              </View>
              <Text style={[styles.perkText, { fontSize: fonts.body, color: colors.textPrimary }]}>
                {p}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.infoBanner,
            { backgroundColor: `${accentColor}12`, borderColor: `${accentColor}33` },
          ]}
        >
          <Text style={[styles.infoText, { fontSize: fonts.caption, color: colors.textSecondary }]}>
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
  planTitle: { fontWeight: '800' },
  priceTag: { fontSize: 32, fontWeight: '900', marginTop: 4 },
  period: { fontWeight: '500' },
  subtext: { marginTop: 4 },
  perksCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  perksHeader: { fontWeight: '700', letterSpacing: 1.5, marginBottom: 16 },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  checkIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  perkText: { flex: 1, lineHeight: 18 },
  infoBanner: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
  },
  infoText: { textAlign: 'center', lineHeight: 18 },
});