import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Moon,
  Globe,
  Bell,
  Shield,
  Download,
  Trash2,
  Lock,
  HelpCircle,
  Info,
  FileText,
  LogOut,
  ChevronRight,
  Check,
} from 'lucide-react-native';
import { ScreenState, UserProfileData } from '@/types';

interface ProfileViewProps {
  profile?: UserProfileData;
  onNavigate: (screen: ScreenState) => void;
}

export function ProfileView({ profile, onNavigate }: ProfileViewProps) {
const user = {
    name: profile?.name || 'Friend',
    email: profile?.email || '',
    streak: profile?.streak ?? 0,
    sessions: profile?.sessions ?? 0,
    memories: profile?.memories ?? 0,
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => onNavigate('auth') },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Profile Header ─── */}
      <View style={styles.headerArea}>
        <View style={styles.avatarWrapper}>
          <LinearGradient
            colors={['#818CF8', '#C084FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarEmoji}>👱</Text>
          </LinearGradient>
          {/* Verified Badge */}
          <View style={styles.verifiedBadge}>
            <Check size={11} color="#FFFFFF" strokeWidth={3} />
          </View>
        </View>

        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>

        {/* 3 Metric Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.sessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.memories}</Text>
            <Text style={styles.statLabel}>Memories</Text>
          </View>
        </View>

        {/* Upgrade to Premium Pill Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onNavigate('subscription')}
          style={styles.upgradeBtnWrapper}
        >
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.upgradeGradient}
          >
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.upgradeBtnText}>Upgrade to Premium</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ─── PREFERENCES ─── */}
      <Text style={styles.sectionTitle}>PREFERENCES</Text>
      <View style={styles.cardGroup}>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => onNavigate('appearance')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconSquare}>
              <Moon size={16} color="rgba(255,255,255,0.7)" />
            </View>
            <Text style={styles.menuLabel}>Appearance</Text>
          </View>
          <View style={styles.menuRight}>
            <Text style={styles.menuValue}>Dark</Text>
            <ChevronRight size={15} color="rgba(255,255,255,0.3)" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => onNavigate('language')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconSquare}>
              <Globe size={16} color="rgba(255,255,255,0.7)" />
            </View>
            <Text style={styles.menuLabel}>Language</Text>
          </View>
          <View style={styles.menuRight}>
            <Text style={styles.menuValue}>English</Text>
            <ChevronRight size={15} color="rgba(255,255,255,0.3)" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuRow, styles.noBorder]}
          onPress={() => onNavigate('notifications')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconSquare}>
              <Bell size={16} color="rgba(255,255,255,0.7)" />
            </View>
            <Text style={styles.menuLabel}>Notifications</Text>
          </View>
          <View style={styles.menuRight}>
            <Text style={styles.menuValue}>On</Text>
            <ChevronRight size={15} color="rgba(255,255,255,0.3)" />
          </View>
        </TouchableOpacity>
      </View>

      {/* ─── PRIVACY ─── */}
      <Text style={styles.sectionTitle}>PRIVACY</Text>
      <View style={styles.cardGroup}>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => onNavigate('privacy')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconSquare}>
              <Shield size={16} color="rgba(255,255,255,0.7)" />
            </View>
            <Text style={styles.menuLabel}>Privacy Settings</Text>
          </View>
          <ChevronRight size={15} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => onNavigate('export-memories')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconSquare}>
              <Download size={16} color="rgba(255,255,255,0.7)" />
            </View>
            <Text style={styles.menuLabel}>Export Memories</Text>
          </View>
          <ChevronRight size={15} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuRow, styles.noBorder]}
          onPress={() => onNavigate('delete-memories')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconSquare, styles.dangerIconSquare]}>
              <Trash2 size={16} color="#F87171" />
            </View>
            <Text style={[styles.menuLabel, { color: '#F87171' }]}>Delete Memories</Text>
          </View>
          <ChevronRight size={15} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>
      </View>

      {/* ─── ACCOUNT ─── */}
      <Text style={styles.sectionTitle}>ACCOUNT</Text>
      <View style={styles.cardGroup}>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => onNavigate('subscription')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconSquare}>
              <Lock size={16} color="rgba(255,255,255,0.7)" />
            </View>
            <Text style={styles.menuLabel}>Subscription</Text>
          </View>
          <View style={styles.menuRight}>
            <Text style={styles.menuValue}>Free</Text>
            <ChevronRight size={15} color="rgba(255,255,255,0.3)" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => onNavigate('help')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconSquare}>
              <HelpCircle size={16} color="rgba(255,255,255,0.7)" />
            </View>
            <Text style={styles.menuLabel}>Help & Support</Text>
          </View>
          <ChevronRight size={15} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => onNavigate('about')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconSquare}>
              <Info size={16} color="rgba(255,255,255,0.7)" />
            </View>
            <Text style={styles.menuLabel}>About Aura</Text>
          </View>
          <ChevronRight size={15} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => onNavigate('terms')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconSquare}>
              <FileText size={16} color="rgba(255,255,255,0.7)" />
            </View>
            <Text style={styles.menuLabel}>Terms & Privacy Policy</Text>
          </View>
          <ChevronRight size={15} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuRow, styles.noBorder]}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconSquare, styles.dangerIconSquare]}>
              <LogOut size={16} color="#F87171" />
            </View>
            <Text style={[styles.menuLabel, { color: '#F87171' }]}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D18',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarGradient: {
    width: 78,
    height: 78,
    borderRadius: 39,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 36,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#0A0D18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#60A5FA',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.45)',
  },
  upgradeBtnWrapper: {
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 4,
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 28,
    gap: 8,
  },
  starIcon: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  upgradeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 4,
  },
  cardGroup: {
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconSquare: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerIconSquare: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  menuLabel: {
    fontSize: 14.5,
    color: '#F8FAFC',
    fontWeight: '500',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuValue: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
  },
});