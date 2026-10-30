import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 12) / 2;

interface GenderOption {
  id: string;
  label: string;
  symbol: string;
}

const GENDER_LIST: GenderOption[] = [
  { id: 'man', label: 'Man', symbol: '♂' },
  { id: 'woman', label: 'Woman', symbol: '♀' },
  { id: 'non-binary', label: 'Non-binary', symbol: '⚧' },
  { id: 'genderfluid', label: 'Genderfluid', symbol: '⚧' },
  { id: 'agender', label: 'Agender', symbol: '∅' },
  { id: 'genderqueer', label: 'Genderqueer', symbol: '✦' },
  { id: 'trans-man', label: 'Transgender Man', symbol: '♂' },
  { id: 'trans-woman', label: 'Transgender Woman', symbol: '♀' },
  { id: 'two-spirit', label: 'Two-Spirit', symbol: '☯' },
  { id: 'intersex', label: 'Intersex', symbol: '⊕' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say', symbol: '—' },
  { id: 'other', label: 'Other', symbol: '+' },
];

interface GenderSelectViewProps {
  onBack?: () => void;
  onComplete: (gender: string) => void;
}

export function GenderSelectView({ onComplete }: GenderSelectViewProps) {
  const [selectedGender, setSelectedGender] = useState<string>('');
  const { colors, fonts, accentColor } = useAppTheme();

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { fontSize: fonts.header, color: colors.textPrimary },
            ]}
          >
            How do you identify?
          </Text>
          <Text
            style={[
              styles.subtitle,
              { fontSize: fonts.caption, color: colors.textSecondary },
            ]}
          >
            Aura uses this to personalize your experience with care and respect.
          </Text>
        </View>

        {/* 2-Column Gender Grid */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        >
          {GENDER_LIST.map((item) => {
            const isSelected = selectedGender === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.75}
                onPress={() => setSelectedGender(item.id)}
                style={[
                  styles.genderCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isSelected ? accentColor : colors.border,
                    borderWidth: isSelected ? 1.5 : 1,
                  },
                  isSelected && {
                    backgroundColor: `${accentColor}1A`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.symbolText,
                    { color: isSelected ? accentColor : colors.textMuted },
                  ]}
                >
                  {item.symbol}
                </Text>
                <Text
                  style={[
                    styles.labelText,
                    {
                      fontSize: fonts.caption,
                      color: isSelected ? colors.textPrimary : colors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onComplete(selectedGender)}
            style={[
              styles.ctaButton,
              {
                backgroundColor: accentColor,
                shadowColor: accentColor,
              },
            ]}
          >
            <Text style={[styles.ctaButtonText, { fontSize: fonts.body }]}>
              Get Started →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 20,
  },
  scrollArea: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 16,
    gap: 10,
  },
  genderCard: {
    width: CARD_WIDTH,
    height: 78,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  symbolText: {
    fontSize: 18,
    marginBottom: 4,
  },
  labelText: {
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 14,
  },
  ctaButton: {
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});