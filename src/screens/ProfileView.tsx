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
import { useAppTheme } from '@/context/ThemeContext';

interface ProfileViewProps {
  profile?: UserProfileData;
  onNavigate: (screen: ScreenState) => void;
}

export function ProfileView({ profile, onNavigate }: ProfileViewProps) {
  const { colors, fonts, accentColor, theme, fontSize } = useAppTheme();

  const user = {
    name: profile?.name || 'Tanmay',
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
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Profile Header ─── */}
      <View style={styles.headerArea}>
        <View style={styles.avatarWrapper}>
          <LinearGradient
            colors={[accentColor, '#C084FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarEmoji}>👱</Text>
          </LinearGradient>
          <View style={[styles.verifiedBadge, { borderColor: colors.background }]}>
            <Check size={11} color="#FFFFFF" strokeWidth={3} />
          </View>
        </View>

        <Text style={[styles.userName, { fontSize: fonts.title, color: colors.textPrimary }]}>{user.name}</Text>
        <Text style={[styles.userEmail, { fontSize: fonts.caption, color: colors.textMuted }]}>{user.email}</Text>

        {/* 3 Metric Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { fontSize: fonts.title, color: accentColor }]}>{user.streak}</Text>
            <Text style={[styles.statLabel, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { fontSize: fonts.title, color: accentColor }]}>{user.sessions}</Text>
            <Text style={[styles.statLabel, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>Sessions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { fontSize: fonts.title, color: accentColor }]}>{user.memories}</Text>
            <Text style={[styles.statLabel, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>Memories</Text>
          </View>
        </View>

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
            <Text style={[styles.upgradeBtnText, { fontSize: fonts.body }]}>Upgrade to Premium</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ─── PREFERENCES ─── */}
      <Text style={[styles.sectionTitle, { fontSize: fonts.caption, color: colors.textMuted }]}>PREFERENCES</Text>
      <View style={[styles.cardGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.menuRow, { borderBottomColor: colors.border }]}
          onPress={() => onNavigate('appearance')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconSquare, { backgroundColor: colors.background }]}>
              <Moon size={16} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuLabel, { fontSize: fonts.body, color: colors.textPrimary }]}>Appearance</Text>
          </View>
          <View style={styles.menuRight}>
            <Text style={[styles.menuValue, { fontSize: fonts.caption, color: colors.textMuted }]}>
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </Text>
            <ChevronRight size={15} color={colors.textMuted} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuRow, { borderBottomColor: colors.border }]}
          onPress={() => onNavigate('language')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconSquare, { backgroundColor: colors.background }]}>
              <Globe size={16} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuLabel, { fontSize: fonts.body, color: colors.textPrimary }]}>Language</Text>
          </View>
          <View style={styles.menuRight}>
            <Text style={[styles.menuValue, { fontSize: fonts.caption, color: colors.textMuted }]}>English</Text>
            <ChevronRight size={15} color={colors.textMuted} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuRow, styles.noBorder]}
          onPress={() => onNavigate('notifications')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconSquare, { backgroundColor: colors.background }]}>
              <Bell size={16} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuLabel, { fontSize: fonts.body, color: colors.textPrimary }]}>Notifications</Text>
          </View>
          <View style={styles.menuRight}>
            <Text style={[styles.menuValue, { fontSize: fonts.caption, color: colors.textMuted }]}>On</Text>
            <ChevronRight size={15} color={colors.textMuted} />
          </View>
        </TouchableOpacity>
      </View>

      {/* ─── PRIVACY ─── */}
      <Text style={[styles.sectionTitle, { fontSize: fonts.caption, color: colors.textMuted }]}>PRIVACY</Text>
      <View style={[styles.cardGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.menuRow, { borderBottomColor: colors.border }]}
          onPress={() => onNavigate('privacy')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconSquare, { backgroundColor: colors.background }]}>
              <Shield size={16} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuLabel, { fontSize: fonts.body, color: colors.textPrimary }]}>Privacy Settings</Text>
          </View>
          <ChevronRight size={15} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuRow, { borderBottomColor: colors.border }]}
          onPress={() => onNavigate('export-memories')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconSquare, { backgroundColor: colors.background }]}>
              <Download size={16} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuLabel, { fontSize: fonts.body, color: colors.textPrimary }]}>Export Memories</Text>
          </View>
          <ChevronRight size={15} color={colors.textMuted} />
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
            <Text style={[styles.menuLabel, { fontSize: fonts.body, color: '#F87171' }]}>Delete Memories</Text>
          </View>
          <ChevronRight size={15} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* ─── ACCOUNT ─── */}
      <Text style={[styles.sectionTitle, { fontSize: fonts.caption, color: colors.textMuted }]}>ACCOUNT</Text>
      <View style={[styles.cardGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.menuRow, { borderBottomColor: colors.border }]}
          onPress={() => onNavigate('subscription')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconSquare, { backgroundColor: colors.background }]}>
              <Lock size={16} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuLabel, { fontSize: fonts.body, color: colors.textPrimary }]}>Subscription</Text>
          </View>
          <View style={styles.menuRight}>
            <Text style={[styles.menuValue, { fontSize: fonts.caption, color: colors.textMuted }]}>Free</Text>
            <ChevronRight size={15} color={colors.textMuted} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuRow, { borderBottomColor: colors.border }]}
          onPress={() => onNavigate('help')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconSquare, { backgroundColor: colors.background }]}>
              <HelpCircle size={16} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuLabel, { fontSize: fonts.body, color: colors.textPrimary }]}>Help & Support</Text>
          </View>
          <ChevronRight size={15} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuRow, { borderBottomColor: colors.border }]}
          onPress={() => onNavigate('about')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconSquare, { backgroundColor: colors.background }]}>
              <Info size={16} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuLabel, { fontSize: fonts.body, color: colors.textPrimary }]}>About Aura</Text>
          </View>
          <ChevronRight size={15} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuRow, { borderBottomColor: colors.border }]}
          onPress={() => onNavigate('terms')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconSquare, { backgroundColor: colors.background }]}>
              <FileText size={16} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuLabel, { fontSize: fonts.body, color: colors.textPrimary }]}>Terms & Privacy Policy</Text>
          </View>
          <ChevronRight size={15} color={colors.textMuted} />
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
            <Text style={[styles.menuLabel, { fontSize: fonts.body, color: '#F87171' }]}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontWeight: '800',
    marginBottom: 2,
  },
  userEmail: {
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
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {},
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
    fontWeight: '700',
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 4,
  },
  cardGroup: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerIconSquare: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  menuLabel: {
    fontWeight: '500',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuValue: {},
});