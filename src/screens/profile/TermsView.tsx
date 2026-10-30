import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeContext';

const PRIVACY_SECTIONS = [
  {
    num: 1,
    title: 'What We Collect',
    body: 'When you use Aura, we collect information you provide directly — your name, journal entries, chat messages, and emotional check-ins. We also collect usage data such as session duration and feature interactions to improve the app experience.',
  },
  {
    num: 2,
    title: 'How We Use Your Data',
    body: 'Your data is used solely to power your personal Aura experience. We train our AI on anonymized, aggregated patterns — never on your identifiable content without consent. We never sell your personal data to advertisers or data brokers.',
  },
  {
    num: 3,
    title: 'Data Security',
    body: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Our servers are hosted in SOC 2 Type II certified facilities. We conduct regular security audits and penetration tests.',
  },
  {
    num: 4,
    title: 'Your Rights',
    body: 'You can access, export, or permanently delete your data at any time from Settings → Privacy. You may also request data erasure by contacting privacy@aura.ai. We comply with GDPR, CCPA, and applicable data protection regulations.',
  },
  {
    num: 5,
    title: 'Third-Party Services',
    body: 'We use limited, carefully vetted third-party services (authentication, cloud infrastructure, analytics). Each is contractually bound to handle your data per our strict privacy standards. We never share identifiable emotional data with them.',
  },
  {
    num: 6,
    title: "Children's Privacy",
    body: 'Aura is not intended for users under 13. We do not knowingly collect personal information from children. If we become aware we have inadvertently done so, we delete it immediately.',
  },
];

const TERMS_SECTIONS = [
  {
    num: 1,
    title: 'Acceptance',
    body: 'By creating an Aura account or using our services, you agree to these Terms of Service and our Privacy Policy. If you disagree with any part, please discontinue use of the service.',
  },
  {
    num: 2,
    title: 'Use of Service',
    body: 'Aura is a personal emotional wellness companion. You agree to use it only for lawful, personal purposes. You must not misuse the platform to harass others, spread harmful content, or attempt to circumvent our safety systems.',
  },
  {
    num: 3,
    title: 'Not a Medical Service',
    body: 'Aura is an AI-powered wellness tool and is not a substitute for professional mental health treatment, therapy, or crisis intervention. If you are experiencing a mental health emergency, please contact emergency services or a crisis hotline immediately.',
  },
  {
    num: 4,
    title: 'Your Content',
    body: 'You retain ownership of all content you create — journals, messages, and uploads. By using Aura, you grant us a limited license to process your content to deliver the service. This license ends when you delete your account.',
  },
  {
    num: 5,
    title: 'Subscriptions & Billing',
    body: 'Premium subscriptions are billed monthly or annually as selected. Subscriptions auto-renew unless cancelled at least 24 hours before the renewal date. Refunds are handled per the App Store or Play Store policies of your platform.',
  },
  {
    num: 6,
    title: 'Termination',
    body: 'We may suspend or terminate accounts that violate these terms. You may delete your account at any time. Upon termination, your data will be erased within 30 days unless retention is required by law.',
  },
  {
    num: 7,
    title: 'Limitation of Liability',
    body: 'Aura is provided "as is" without warranties of any kind. To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the service.',
  },
  {
    num: 8,
    title: 'Changes to Terms',
    body: 'We may update these terms from time to time. We will notify you via in-app notification at least 14 days before material changes take effect. Continued use after that date constitutes acceptance.',
  },
];

export function TermsView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');
  const { colors, fonts, accentColor } = useAppTheme();
  const sections = activeTab === 'privacy' ? PRIVACY_SECTIONS : TERMS_SECTIONS;

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
          Terms & Privacy
        </Text>
      </View>

      {/* Pill Toggle Tab Switcher */}
      <View style={styles.tabTrackWrapper}>
        <View style={[styles.tabTrack, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'privacy' && { backgroundColor: `${accentColor}2A` },
            ]}
            onPress={() => setActiveTab('privacy')}
            activeOpacity={0.8}
          >
            <Text style={styles.tabEmoji}>🔒</Text>
            <Text
              style={[
                styles.tabText,
                { fontSize: fonts.caption, color: colors.textSecondary },
                activeTab === 'privacy' && { color: accentColor, fontWeight: '700' },
              ]}
            >
              Privacy Policy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'terms' && { backgroundColor: `${accentColor}2A` },
            ]}
            onPress={() => setActiveTab('terms')}
            activeOpacity={0.8}
          >
            <Text style={styles.tabEmoji}>📋</Text>
            <Text
              style={[
                styles.tabText,
                { fontSize: fonts.caption, color: colors.textSecondary },
                activeTab === 'terms' && { color: accentColor, fontWeight: '700' },
              ]}
            >
              Terms of Service
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Section Cards */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.dateStamp, { fontSize: fonts.caption, color: colors.textMuted }]}>
          Last updated: October 1, 2025 · Effective: October 15, 2025
        </Text>

        <View style={styles.cardsStack}>
          {sections.map((item) => (
            <View
              key={item.num}
              style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.sectionTitleRow}>
                <View style={[styles.numberBadge, { backgroundColor: `${accentColor}25` }]}>
                  <Text style={[styles.numberText, { color: accentColor }]}>{item.num}</Text>
                </View>
                <Text style={[styles.sectionHeading, { fontSize: fonts.body, color: colors.textPrimary }]}>
                  {item.title}
                </Text>
              </View>
              <Text style={[styles.sectionBody, { fontSize: fonts.caption, color: colors.textSecondary }]}>
                {item.body}
              </Text>
            </View>
          ))}
        </View>

        {/* Contact Footer Box */}
        <View style={[styles.footerBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.footerText, { fontSize: fonts.caption, color: colors.textSecondary }]}>
            Questions? Contact us at{' '}
            <Text
              style={[styles.footerLink, { color: accentColor }]}
              onPress={() => Linking.openURL('mailto:legal@aura.ai')}
            >
              legal@aura.ai
            </Text>
          </Text>
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
    paddingBottom: 14,
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
  tabTrackWrapper: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tabTrack: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  tabEmoji: {
    fontSize: 13,
  },
  tabText: {
    fontWeight: '600',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  dateStamp: {
    marginBottom: 14,
    marginTop: 4,
  },
  cardsStack: {
    gap: 12,
  },
  sectionCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeading: {
    fontWeight: '700',
  },
  sectionBody: {
    lineHeight: 20,
  },
  footerBox: {
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 18,
    borderWidth: 1,
  },
  footerText: {},
  footerLink: {
    fontWeight: '600',
  },
});