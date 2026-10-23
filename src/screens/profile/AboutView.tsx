import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  FileText,
  BookOpen,
  Star,
} from 'lucide-react-native';
import { GlowingOrb } from '@/components/common/GlowingOrb';

interface AboutViewProps {
  onBack: () => void;
  onNavigate?: (screen: any) => void;
}

export function AboutView({ onBack, onNavigate }: AboutViewProps) {
  const handleOpenLink = (title: string, url?: string) => {
    if (url) {
      Linking.openURL(url);
    } else {
      Alert.alert(title, `Opening ${title}...`);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Top Header */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>About Aura</Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Center Hero */}
        <View style={styles.brandHero}>
          <GlowingOrb size={64} />
          <Text style={styles.brandTitle}>Aura</Text>
          <Text style={styles.versionText}>Version 2.4.1 · Build 2026.10</Text>
        </View>

        {/* Our Mission Card */}
        <View style={styles.missionCard}>
          <Text style={styles.missionTitle}>Our Mission</Text>
          <Text style={styles.missionBody}>
            Aura exists to ensure no one ever feels alone with their emotions. We believe that having a safe, judgment-free space to express yourself is fundamental to mental wellness — and we're building that space, powered by empathetic AI.
          </Text>
        </View>

        {/* 3 Metrics Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>2M+</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>50M+</Text>
            <Text style={styles.statLabel}>Chats</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4.9★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Links Group Card */}
        <View style={styles.linksCard}>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => onNavigate ? onNavigate('terms') : handleOpenLink('Privacy Policy')}
            activeOpacity={0.7}
          >
            <View style={styles.linkLeft}>
              <Shield size={16} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.linkLabel}>Privacy Policy</Text>
            </View>
            <ChevronRight size={15} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => onNavigate ? onNavigate('terms') : handleOpenLink('Terms of Service')}
            activeOpacity={0.7}
          >
            <View style={styles.linkLeft}>
              <FileText size={16} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.linkLabel}>Terms of Service</Text>
            </View>
            <ChevronRight size={15} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => handleOpenLink('Open Source Licenses')}
            activeOpacity={0.7}
          >
            <View style={styles.linkLeft}>
              <BookOpen size={16} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.linkLabel}>Open Source Licenses</Text>
            </View>
            <ChevronRight size={15} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.linkRow, styles.noBorder]}
            onPress={() => handleOpenLink('Rate on Play Store')}
            activeOpacity={0.7}
          >
            <View style={styles.linkLeft}>
              <Star size={16} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.linkLabel}>Rate on Play Store</Text>
            </View>
            <ChevronRight size={15} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>Made with 💙 by the Aura Team</Text>
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
  brandHero: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#D8B4FE',
    marginTop: 14,
    letterSpacing: -0.5,
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  missionCard: {
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 14,
  },
  missionTitle: {
    color: '#A78BFA',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  missionBody: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#818CF8',
    marginBottom: 2,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    fontWeight: '500',
  },
  linksCard: {
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  linkRow: {
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
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  linkLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '500',
  },
  footerText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 12,
    marginTop: 26,
    fontWeight: '500',
  },
});