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

export function PrivacyView({ onBack }: { onBack: () => void }) {
  const [shareUsage, setShareUsage] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [personalizedAi, setPersonalizedAi] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Top Header */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Privacy Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* DATA & PRIVACY SECTION */}
        <Text style={styles.sectionHeader}>DATA & PRIVACY</Text>
        <View style={styles.cardGroup}>
          <View style={styles.settingRow}>
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>Share Usage Data</Text>
              <Text style={styles.subText}>Help improve Aura with anonymous data</Text>
            </View>
            <ToggleSwitch value={shareUsage} onToggle={() => setShareUsage(!shareUsage)} />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>Analytics</Text>
              <Text style={styles.subText}>Allow crash reports and diagnostics</Text>
            </View>
            <ToggleSwitch value={analytics} onToggle={() => setAnalytics(!analytics)} />
          </View>

          <View style={[styles.settingRow, styles.noBorder]}>
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>Personalized AI</Text>
              <Text style={styles.subText}>Use your history to improve responses</Text>
            </View>
            <ToggleSwitch
              value={personalizedAi}
              onToggle={() => setPersonalizedAi(!personalizedAi)}
            />
          </View>
        </View>

        {/* SECURITY SECTION */}
        <Text style={styles.sectionHeader}>SECURITY</Text>
        <View style={styles.cardGroup}>
          <View style={styles.settingRow}>
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>Face ID / Biometric</Text>
              <Text style={styles.subText}>Lock app with biometric authentication</Text>
            </View>
            <ToggleSwitch value={biometrics} onToggle={() => setBiometrics(!biometrics)} />
          </View>

          <View style={[styles.settingRow, styles.noBorder]}>
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>Two-Factor Auth</Text>
              <Text style={styles.subText}>Add an extra layer of security</Text>
            </View>
            <ToggleSwitch value={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
          </View>
        </View>

        {/* Bottom Encryption Disclaimer Box */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
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
  sectionHeader: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 4,
  },
  cardGroup: {
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  textContainer: {
    flex: 1,
    paddingRight: 14,
  },
  titleText: {
    color: '#F8FAFC',
    fontSize: 14.5,
    fontWeight: '600',
    marginBottom: 3,
  },
  subText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    lineHeight: 17,
  },
  disclaimerBox: {
    backgroundColor: 'rgba(30, 27, 75, 0.45)',
    borderColor: 'rgba(129, 140, 248, 0.22)',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  disclaimerText: {
    color: 'rgba(199, 210, 254, 0.85)',
    fontSize: 12.5,
    lineHeight: 19,
    textAlign: 'center',
  },
});