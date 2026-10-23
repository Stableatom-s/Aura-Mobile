import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Star, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { ScreenState, UserProfileData } from '@/types';

interface ProfileViewProps {
  profile: UserProfileData;
  onNavigate: (screen: ScreenState) => void;
}

export function ProfileView({ profile, onNavigate }: ProfileViewProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      {/* User Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={{ fontSize: 36 }}>🧑</Text>
        </View>
        <Text style={styles.userName}>{profile.name}</Text>
        <Text style={styles.userEmail}>{profile.email}</Text>

        <TouchableOpacity style={styles.upgradeBtn} onPress={() => onNavigate('subscription')}>
          <Star size={14} color="#fff" fill="#fff" />
          <Text style={styles.upgradeBtnText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <Text style={styles.sectionHeader}>PREFERENCES</Text>
      <View style={styles.cardGroup}>
        <TouchableOpacity style={styles.rowItem} onPress={() => onNavigate('appearance')}>
          <Text style={styles.rowLabel}>Appearance</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowItem} onPress={() => onNavigate('language')}>
          <Text style={styles.rowLabel}>Language</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowItem} onPress={() => onNavigate('notifications')}>
          <Text style={styles.rowLabel}>Notifications</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
      </View>

      {/* Privacy Section */}
      <Text style={styles.sectionHeader}>PRIVACY</Text>
      <View style={styles.cardGroup}>
        <TouchableOpacity style={styles.rowItem} onPress={() => onNavigate('privacy')}>
          <Text style={styles.rowLabel}>Privacy Settings</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowItem} onPress={() => onNavigate('export-memories')}>
          <Text style={styles.rowLabel}>Export Memories</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowItem} onPress={() => onNavigate('delete-memories')}>
          <Text style={[styles.rowLabel, { color: Colors.danger }]}>Delete Memories</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
      </View>

      {/* Account Section */}
      <Text style={styles.sectionHeader}>ACCOUNT</Text>
      <View style={styles.cardGroup}>
        <TouchableOpacity style={styles.rowItem} onPress={() => onNavigate('subscription')}>
          <Text style={styles.rowLabel}>Subscription</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowItem} onPress={() => onNavigate('help')}>
          <Text style={styles.rowLabel}>Help & Support</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowItem} onPress={() => onNavigate('about')}>
          <Text style={styles.rowLabel}>About Aura</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowItem} onPress={() => onNavigate('terms')}>
          <Text style={styles.rowLabel}>Terms & Privacy Policy</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  profileHeader: { alignItems: 'center', paddingVertical: 18 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: { fontSize: 22, fontWeight: '800', color: '#F8FAFC' },
  userEmail: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 2 },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#D97706',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 14,
  },
  upgradeBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  sectionHeader: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    letterSpacing: 1.5,
    marginTop: 18,
    marginBottom: 8,
    fontWeight: '700',
  },
  cardGroup: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  rowLabel: { color: '#F8FAFC', fontSize: 15 },
});