import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenState } from '@/types';
import { useAppTheme } from '@/context/ThemeContext';

interface AboutViewProps {
  onBack?: () => void;
  onNavigate?: (screen: ScreenState) => void;
}

export function AboutView({ onBack }: AboutViewProps) {
  const { colors, fonts, accentColor } = useAppTheme();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontSize: fonts.subheading }]}>
          About Aura
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Hero Badge */}
        <View style={styles.heroSection}>
          <View
            style={[
              styles.logoBadge,
              { backgroundColor: `${accentColor}1A`, borderColor: accentColor },
            ]}
          >
            <Ionicons name="sparkles" size={36} color={accentColor} />
          </View>
          <Text style={[styles.appName, { color: colors.textPrimary, fontSize: fonts.header }]}>
            Aura
          </Text>
          <Text style={[styles.appVersion, { color: colors.textMuted, fontSize: fonts.caption }]}>
            Version 1.0.0 • Build 2026.1
          </Text>
        </View>

        {/* Mission Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: fonts.subheading }]}>
            Our Mission
          </Text>
          <Text style={[styles.cardBody, { color: colors.textSecondary, fontSize: fonts.body }]}>
            Aura is designed to provide a calm sanctuary for emotional clarity, mindful reflection, and personal growth. Powered by empathetic AI coaching and secure journaling, Aura helps you understand your emotional patterns one day at a time.
          </Text>
        </View>

        {/* Links Section */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 16 }]}>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => handleOpenLink('https://aura.ai/privacy')}
            activeOpacity={0.7}
          >
            <Ionicons name="shield-checkmark-outline" size={20} color={accentColor} />
            <Text style={[styles.linkText, { color: colors.textPrimary, fontSize: fonts.body }]}>
              Privacy Architecture
            </Text>
            <Ionicons name="open-outline" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => handleOpenLink('https://aura.ai/terms')}
            activeOpacity={0.7}
          >
            <Ionicons name="document-text-outline" size={20} color={accentColor} />
            <Text style={[styles.linkText, { color: colors.textPrimary, fontSize: fonts.body }]}>
              Terms of Service
            </Text>
            <Ionicons name="open-outline" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => handleOpenLink('https://aura.ai')}
            activeOpacity={0.7}
          >
            <Ionicons name="globe-outline" size={20} color={accentColor} />
            <Text style={[styles.linkText, { color: colors.textPrimary, fontSize: fonts.body }]}>
              Official Website
            </Text>
            <Ionicons name="open-outline" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.copyright, { color: colors.textMuted, fontSize: fonts.caption }]}>
          © 2026 Aura Technologies. All rights reserved.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '700',
  },
  placeholder: {
    width: 38,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  appName: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  appVersion: {
    marginTop: 4,
    fontWeight: '500',
  },
  card: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  cardTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  cardBody: {
    lineHeight: 22,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  linkText: {
    flex: 1,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  copyright: {
    marginTop: 32,
    textAlign: 'center',
  },
});