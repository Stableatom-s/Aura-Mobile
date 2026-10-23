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

// Enable layout animation on Android
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

  const toggleAccordion = (idx: number) => {
    // Hardware accelerated smooth layout transition (no JS thread blocking)
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
    <SafeAreaView style={styles.safeContainer}>
      {/* Top Header */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Help & Support</Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top 2 Action Cards */}
        <View style={styles.cardsRow}>
          <TouchableOpacity
            style={styles.topCard}
            onPress={handleLiveChat}
            activeOpacity={0.75}
          >
            <View style={styles.purpleIconCircle}>
              <MessageSquare size={17} color="#818CF8" />
            </View>
            <Text style={styles.cardTitle}>Live Chat</Text>
            <Text style={styles.cardSub}>Talk to support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topCard}
            onPress={handleEmail}
            activeOpacity={0.75}
          >
            <View style={styles.emeraldIconCircle}>
              <Mail size={17} color="#34D399" />
            </View>
            <Text style={styles.cardTitle}>Email Us</Text>
            <Text style={styles.cardSub}>support@aura.ai</Text>
          </TouchableOpacity>
        </View>

        {/* FREQUENTLY ASKED */}
        <Text style={styles.sectionHeader}>FREQUENTLY ASKED</Text>

        <View style={styles.faqStack}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <View
                key={idx}
                style={[styles.faqCard, isOpen && styles.faqCardOpen]}
              >
                <TouchableOpacity
                  style={styles.faqHeaderRow}
                  onPress={() => toggleAccordion(idx)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestionText}>{faq.q}</Text>
                  {isOpen ? (
                    <ChevronUp size={16} color="#818CF8" />
                  ) : (
                    <ChevronDown size={16} color="rgba(255, 255, 255, 0.45)" />
                  )}
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.answerContainer}>
                    <Text style={styles.faqAnswerText}>{faq.a}</Text>
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
    backgroundColor: '#0A0D18',
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
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
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
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  purpleIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(129, 140, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emeraldIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  cardSub: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
  },
  sectionHeader: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 11,
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
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  faqCardOpen: {
    borderColor: 'rgba(129, 140, 248, 0.35)',
    backgroundColor: 'rgba(26, 31, 56, 0.85)',
  },
  faqHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    paddingRight: 12,
  },
  answerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  faqAnswerText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
    lineHeight: 20,
  },
});