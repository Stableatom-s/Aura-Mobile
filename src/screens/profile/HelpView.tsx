import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Linking,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { ChevronLeft, ChevronDown, ChevronUp, MessageSquare, Mail } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'How does Aura understand my emotions?',
    a: 'Aura uses emotional intelligence algorithms trained to understand tone, word choice, and contextual cues from your check-ins and reflections, offering compassionate and relevant guidance.',
  },
  {
    q: 'Is my data private and secure?',
    a: 'All personal journal entries, voice check-ins, and conversation records are encrypted end-to-end and stored locally on your device. We do not sell or share personal emotional data.',
  },
  {
    q: 'Can I use Aura offline?',
    a: 'Yes. Daily journaling, breathing exercises, local habit streaks, and viewing past records function offline without an active internet connection.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Go to Settings → Privacy → Delete Memories to permanently erase all local conversation transcripts, mood logs, and account records from your device.',
  },
  {
    q: 'What is Premium?',
    a: 'Aura Premium includes unlimited AI chat turns, full voice companion mode, 30-day and all-time mood trajectory analytics, personalized growth plans, and complete memory exports.',
  },
];

export function HelpView({ onBack }: { onBack: () => void }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { colors, fonts, accentColor } = useAppTheme();

  const toggleAccordion = (idx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  const handleLiveChat = () => {
    Alert.alert('Live Chat', 'Connecting with an Aura wellness support specialist...');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@aura.ai');
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { fontSize: fonts.title, color: colors.textPrimary }]}>
          Help & Support
        </Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top 2 Action Cards */}
        <View style={styles.cardsRow}>
          <TouchableOpacity
            style={[styles.topCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleLiveChat}
            activeOpacity={0.75}
          >
            <View style={[styles.iconCircle, { backgroundColor: `${accentColor}1A` }]}>
              <MessageSquare size={17} color={accentColor} />
            </View>
            <Text style={[styles.cardTitle, { fontSize: fonts.body, color: colors.textPrimary }]}>
              Live Chat
            </Text>
            <Text style={[styles.cardSub, { fontSize: fonts.caption, color: colors.textMuted }]}>
              Talk to support
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.topCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleEmail}
            activeOpacity={0.75}
          >
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Mail size={17} color="#10B981" />
            </View>
            <Text style={[styles.cardTitle, { fontSize: fonts.body, color: colors.textPrimary }]}>
              Email Us
            </Text>
            <Text style={[styles.cardSub, { fontSize: fonts.caption, color: colors.textMuted }]}>
              support@aura.ai
            </Text>
          </TouchableOpacity>
        </View>

        {/* FREQUENTLY ASKED */}
        <Text style={[styles.sectionHeader, { fontSize: fonts.caption, color: colors.textMuted }]}>
          FREQUENTLY ASKED
        </Text>

        <View style={styles.faqStack}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <View
                key={idx}
                style={[
                  styles.faqCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  isOpen && {
                    borderColor: accentColor,
                    backgroundColor: `${accentColor}0D`,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.faqHeaderRow}
                  onPress={() => toggleAccordion(idx)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.faqQuestionText, { fontSize: fonts.body, color: colors.textPrimary }]}>
                    {faq.q}
                  </Text>
                  {isOpen ? (
                    <ChevronUp size={16} color={accentColor} />
                  ) : (
                    <ChevronDown size={16} color={colors.textMuted} />
                  )}
                </TouchableOpacity>

                {isOpen && (
                  <View style={[styles.answerContainer, { borderTopColor: colors.border }]}>
                    <Text style={[styles.faqAnswerText, { fontSize: fonts.caption, color: colors.textSecondary }]}>
                      {faq.a}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 16,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontWeight: '800',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  topCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontWeight: '700',
    marginBottom: 3,
  },
  cardSub: {
    fontWeight: '500',
  },
  sectionHeader: {
    letterSpacing: 1.5,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 4,
  },
  faqStack: {
    gap: 10,
  },
  faqCard: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
  },
  faqHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontWeight: '600',
    flex: 1,
    paddingRight: 12,
  },
  answerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  faqAnswerText: {
    lineHeight: 20,
  },
});