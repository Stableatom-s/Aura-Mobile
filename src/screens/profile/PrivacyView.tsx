import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { useAppTheme } from '@/context/ThemeContext';

export function PrivacyView({ onBack }: { onBack: () => void }) {
  const { colors, fonts, accentColor } = useAppTheme();
  const [shareUsage, setShareUsage] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [personalizedAi, setPersonalizedAi] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

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
          Privacy Settings
        </Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* DATA & PRIVACY SECTION */}
        <Text style={[styles.sectionHeader, { fontSize: fonts.caption, color: colors.textMuted }]}>
          DATA & PRIVACY
        </Text>
        <View style={[styles.cardGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.textContainer}>
              <Text style={[styles.titleText, { fontSize: fonts.body, color: colors.textPrimary }]}>
                Share Usage Data
              </Text>
              <Text style={[styles.subText, { fontSize: fonts.caption, color: colors.textSecondary }]}>
                Help improve Aura with anonymous data
              </Text>
            </View>
            <ToggleSwitch
              value={shareUsage}
              onToggle={() => setShareUsage(!shareUsage)}
              
            />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.textContainer}>
              <Text style={[styles.titleText, { fontSize: fonts.body, color: colors.textPrimary }]}>
                Analytics
              </Text>
              <Text style={[styles.subText, { fontSize: fonts.caption, color: colors.textSecondary }]}>
                Allow crash reports and diagnostics
              </Text>
            </View>
            <ToggleSwitch
              value={analytics}
              onToggle={() => setAnalytics(!analytics)}
              
            />
          </View>

          <View style={[styles.settingRow, styles.noBorder]}>
            <View style={styles.textContainer}>
              <Text style={[styles.titleText, { fontSize: fonts.body, color: colors.textPrimary }]}>
                Personalized AI
              </Text>
              <Text style={[styles.subText, { fontSize: fonts.caption, color: colors.textSecondary }]}>
                Use your history to improve responses
              </Text>
            </View>
            <ToggleSwitch
              value={personalizedAi}
              onToggle={() => setPersonalizedAi(!personalizedAi)}
              
            />
          </View>
        </View>

        {/* SECURITY SECTION */}
        <Text style={[styles.sectionHeader, { fontSize: fonts.caption, color: colors.textMuted }]}>
          SECURITY
        </Text>
        <View style={[styles.cardGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.textContainer}>
              <Text style={[styles.titleText, { fontSize: fonts.body, color: colors.textPrimary }]}>
                Face ID / Biometric
              </Text>
              <Text style={[styles.subText, { fontSize: fonts.caption, color: colors.textSecondary }]}>
                Lock app with biometric authentication
              </Text>
            </View>
            <ToggleSwitch
              value={biometrics}
              onToggle={() => setBiometrics(!biometrics)}
              
            />
          </View>

          <View style={[styles.settingRow, styles.noBorder]}>
            <View style={styles.textContainer}>
              <Text style={[styles.titleText, { fontSize: fonts.body, color: colors.textPrimary }]}>
                Two-Factor Auth
              </Text>
              <Text style={[styles.subText, { fontSize: fonts.caption, color: colors.textSecondary }]}>
                Add an extra layer of security
              </Text>
            </View>
            <ToggleSwitch
              value={twoFactor}
              onToggle={() => setTwoFactor(!twoFactor)}
              
            />
          </View>
        </View>

        {/* Bottom Encryption Disclaimer Box */}
        <View
          style={[
            styles.disclaimerBox,
            {
              backgroundColor: `${accentColor}12`,
              borderColor: `${accentColor}33`,
            },
          ]}
        >
          <Text style={[styles.disclaimerText, { fontSize: fonts.caption, color: colors.textSecondary }]}>
            Your emotional data is encrypted end-to-end and stored locally on your device. We never sell your data.
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
  sectionHeader: {
    letterSpacing: 1.5,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 4,
  },
  cardGroup: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  textContainer: {
    flex: 1,
    paddingRight: 14,
  },
  titleText: {
    fontWeight: '600',
    marginBottom: 3,
  },
  subText: {
    lineHeight: 17,
  },
  disclaimerBox: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  disclaimerText: {
    lineHeight: 19,
    textAlign: 'center',
  },
});