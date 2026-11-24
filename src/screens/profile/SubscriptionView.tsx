import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Check, Star } from 'lucide-react-native';
import { BackHeader } from '@/components/common/BackHeader';
import { GradientButton } from '@/components/ui/GradientButton';
import { useAppTheme } from '@/context/ThemeContext';

interface SubscriptionViewProps {
  onBack: () => void;
  isPremium: boolean;
  onSelectPlan?: (tier: 'monthly' | 'yearly') => void;
}

const PERKS = [
  'Unlimited Gemini AI emotional dialogues',
  'Real-time voice check-in orb audio mode',
  'Automated multi-prompt daily journal reflections',
  'Complete 30-day and all-time mood trajectory analytics',
  'High-bitrate soothing meditation sessions',
];

export function SubscriptionView({ onBack, isPremium, onSelectPlan }: SubscriptionViewProps) {
  const { colors, fonts, accentColor } = useAppTheme();
  const [selectedTier, setSelectedTier] = useState<'monthly' | 'yearly'>('yearly');

  const handleCheckout = () => {
    if (onSelectPlan) {
      onSelectPlan(selectedTier);
      return;
    }
    Alert.alert(
      'Aura Plus Checkout',
      `Selected ${selectedTier === 'yearly' ? 'Yearly (₹2,499/yr)' : 'Monthly (₹299/mo)'} plan. Payment gateway integration is next!`
    );
  };

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
            {selectedTier === 'yearly' ? '₹2,499' : '₹299'}{' '}
            <Text style={[styles.period, { fontSize: fonts.body, color: colors.textMuted }]}>
              {selectedTier === 'yearly' ? '/ year' : '/ month'}
            </Text>
          </Text>
          <Text style={[styles.subtext, { fontSize: fonts.caption, color: colors.textSecondary }]}>
            Cancel or adjust your membership anytime.
          </Text>
        </View>

        {/* Billing Cycle Selector */}
        {!isPremium && (
          <View style={styles.tierRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedTier('monthly')}
              style={[
                styles.tierCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: selectedTier === 'monthly' ? accentColor : colors.border,
                  borderWidth: selectedTier === 'monthly' ? 1.5 : 1,
                },
              ]}
            >
              <Text style={[styles.tierTitle, { color: colors.textPrimary, fontSize: fonts.body }]}>
                Monthly
              </Text>
              <Text style={[styles.tierPrice, { color: accentColor, fontSize: fonts.subheading }]}>
                ₹299/mo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedTier('yearly')}
              style={[
                styles.tierCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: selectedTier === 'yearly' ? accentColor : colors.border,
                  borderWidth: selectedTier === 'yearly' ? 1.5 : 1,
                },
              ]}
            >
              <View style={[styles.saveBadge, { backgroundColor: `${accentColor}22` }]}>
                <Text style={[styles.saveBadgeText, { color: accentColor }]}>SAVE 30%</Text>
              </View>
              <Text style={[styles.tierTitle, { color: colors.textPrimary, fontSize: fonts.body }]}>
                Yearly
              </Text>
              <Text style={[styles.tierPrice, { color: accentColor, fontSize: fonts.subheading }]}>
                ₹2,499/yr
              </Text>
            </TouchableOpacity>
          </View>
        )}

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

        <GradientButton
          title={isPremium ? 'Active Aura Plus Member' : 'Continue to Upgrade'}
          onPress={handleCheckout}
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
  tierRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  tierCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  saveBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
  tierTitle: { fontWeight: '700', marginBottom: 4 },
  tierPrice: { fontWeight: '800' },
  perksCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
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
});