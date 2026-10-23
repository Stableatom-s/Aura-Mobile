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
import { LinearGradient } from 'expo-linear-gradient';

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

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>How do you identify?</Text>
          <Text style={styles.subtitle}>
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
                  isSelected && styles.genderCardSelected,
                ]}
              >
                <Text style={[styles.symbolText, isSelected && styles.symbolTextSelected]}>
                  {item.symbol}
                </Text>
                <Text style={[styles.labelText, isSelected && styles.labelTextSelected]}>
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
            style={styles.ctaButtonWrapper}
          >
            <LinearGradient
              colors={['#7C3AED', '#6366F1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaButtonText}>Get Started →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0A0D18',
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
    fontSize: 28,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13.5,
    color: 'rgba(255, 255, 255, 0.45)',
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
    backgroundColor: 'rgba(26, 31, 56, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  genderCardSelected: {
    borderColor: '#7C3AED',
    borderWidth: 1.5,
    backgroundColor: 'rgba(124, 58, 237, 0.16)',
  },
  symbolText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 4,
  },
  symbolTextSelected: {
    color: '#A78BFA',
  },
  labelText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '500',
    textAlign: 'center',
  },
  labelTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footer: {
    paddingVertical: 14,
  },
  ctaButtonWrapper: {
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});