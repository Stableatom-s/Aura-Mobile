import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import {
  MessageSquare,
  Mic,
  BookOpen,
  Wind,
  Flame,
  TrendingUp,
  Bell,
} from 'lucide-react-native';
import { GlowingOrb } from '@/components/common/GlowingOrb';
import { ScreenState } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useAppTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');
const EMOTION_GAP = 8;
const EMOTION_WIDTH = (width - 40 - EMOTION_GAP * 3) / 4;

interface EmotionItem {
  id: string;
  labelKey: string;
  emoji: string;
  color: string;
  glowBg: string;
}

const EMOTIONS: EmotionItem[] = [
  { id: 'Happy', labelKey: 'emotion_happy', emoji: '😊', color: '#10B981', glowBg: 'rgba(16, 185, 129, 0.16)' },
  { id: 'Sad', labelKey: 'emotion_sad', emoji: '😔', color: '#60A5FA', glowBg: 'rgba(96, 165, 250, 0.16)' },
  { id: 'Angry', labelKey: 'emotion_angry', emoji: '😡', color: '#EF4444', glowBg: 'rgba(239, 68, 68, 0.16)' },
  { id: 'Calm', labelKey: 'emotion_calm', emoji: '😌', color: '#38BDF8', glowBg: 'rgba(56, 189, 248, 0.16)' },
  { id: 'Anxious', labelKey: 'emotion_anxious', emoji: '😰', color: '#F59E0B', glowBg: 'rgba(245, 158, 11, 0.16)' },
  { id: 'Tired', labelKey: 'emotion_tired', emoji: '🥱', color: '#A78BFA', glowBg: 'rgba(167, 139, 250, 0.16)' },
  { id: 'Loved', labelKey: 'emotion_loved', emoji: '❤️', color: '#F43F5E', glowBg: 'rgba(244, 63, 94, 0.16)' },
  { id: 'Confused', labelKey: 'emotion_confused', emoji: '🤔', color: '#FBBF24', glowBg: 'rgba(251, 191, 36, 0.16)' },
];

interface HomeViewProps {
  userName?: string;
  streak?: number;
  selectedEmotion: string | null;
  hasUnreadNotifications?: boolean;
  onSelectEmotion: (emotion: string) => void;
  onNavigate: (screen: ScreenState | 'notifications') => void;
}

export function HomeView({
  userName = 'Tanmay',
  streak = 14,
  selectedEmotion = 'Sad',
  hasUnreadNotifications = true,
  onSelectEmotion,
  onNavigate,
}: HomeViewProps) {
  const { t } = useLanguage();
  const { colors, fonts, accentColor } = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Top Header: Greeting, User Name & Notification Bell ─── */}
      <View style={styles.topHeader}>
        <View style={styles.greetingContainer}>
          <Text style={[styles.subGreetingText, { fontSize: fonts.caption + 2, color: colors.textSecondary }]}>
            Good morning
          </Text>
          <View style={styles.nameRow}>
            <Text style={[styles.userNameText, { fontSize: fonts.header, color: colors.textPrimary }]}>
              {userName}
            </Text>
            <Text style={styles.waveEmoji}>👋</Text>
          </View>
        </View>

        {/* Frosted Notification Button */}
        <TouchableOpacity
          style={[
            styles.bellButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          activeOpacity={0.75}
          onPress={() => onNavigate('notifications')}
        >
          <Bell size={20} color={colors.textPrimary} />
          {hasUnreadNotifications && (
            <View style={[styles.unreadDot, { backgroundColor: accentColor }]} />
          )}
        </TouchableOpacity>
      </View>

      {/* ─── Center Glowing Orb ─── */}
      <View style={styles.orbCenterContainer}>
        <GlowingOrb size={68} />
      </View>

      {/* ─── Question ─── */}
      <Text style={[styles.questionText, { fontSize: fonts.body, color: colors.textSecondary }]}>
        {t('how_feeling')}
      </Text>

      {/* ─── 4x2 Emotions Grid ─── */}
      <View style={styles.emotionsGrid}>
        {EMOTIONS.map((item) => {
          const isSelected = selectedEmotion === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => onSelectEmotion(item.id)}
              style={[
                styles.emotionCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
                isSelected && {
                  borderColor: item.color,
                  backgroundColor: item.glowBg,
                  borderWidth: 1.5,
                },
              ]}
            >
              <Text style={styles.emotionEmoji}>{item.emoji}</Text>
              <Text
                style={[
                  styles.emotionLabel,
                  { fontSize: fonts.caption },
                  isSelected && { color: item.color, fontWeight: '700' },
                ]}
              >
                {t(item.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ─── Quick Actions ─── */}
      <Text style={[styles.sectionTitle, { fontSize: fonts.caption, color: colors.textMuted }]}>
        {t('quick_actions')}
      </Text>
      <View style={styles.quickActionsRow}>
        {/* Chat */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#818CF8' }]}
          onPress={() => onNavigate('chat')}
          activeOpacity={0.8}
        >
          <MessageSquare size={18} color="#FFFFFF" />
          <Text style={[styles.actionBtnText, { fontSize: fonts.caption }]}>{t('action_chat')}</Text>
        </TouchableOpacity>

        {/* Talk -> leads to VoiceCallView */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#EC4899' }]}
          onPress={() => onNavigate('voice')}
          activeOpacity={0.8}
        >
          <Mic size={18} color="#FFFFFF" />
          <Text style={[styles.actionBtnText, { fontSize: fonts.caption }]}>{t('action_talk')}</Text>
        </TouchableOpacity>

        {/* Journal */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#8B5CF6' }]}
          onPress={() => onNavigate('journal')}
          activeOpacity={0.8}
        >
          <BookOpen size={18} color="#FFFFFF" />
          <Text style={[styles.actionBtnText, { fontSize: fonts.caption }]}>{t('action_journal')}</Text>
        </TouchableOpacity>

        {/* Meditate */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#38BDF8' }]}
          onPress={() => onNavigate('meditate')}
          activeOpacity={0.8}
        >
          <Wind size={18} color="#FFFFFF" />
          <Text style={[styles.actionBtnText, { fontSize: fonts.caption }]}>{t('action_meditate')}</Text>
        </TouchableOpacity>
      </View>

      {/* ─── 2 Metric Stat Cards ─── */}
      <View style={styles.statsTwoColumnRow}>
        {/* Streak Card */}
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.statCardHeader}>
            <Flame size={15} color="#FBBF24" />
            <Text style={[styles.statCardTitle, { fontSize: fonts.caption, color: colors.textSecondary }]}>
              {t('streak')}
            </Text>
          </View>
          <Text style={[styles.statCardNumber, { color: colors.textPrimary }]}>{streak}</Text>
          <Text style={[styles.statCardSub, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>
            {t('days_in_row')}
          </Text>
        </View>

        {/* Avg Mood Card */}
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.statCardHeader}>
            <TrendingUp size={15} color="#34D399" />
            <Text style={[styles.statCardTitle, { fontSize: fonts.caption, color: colors.textSecondary }]}>
              {t('avg_mood')}
            </Text>
          </View>
          <Text style={[styles.statCardNumber, { color: colors.textPrimary }]}>7.8</Text>
          <Text style={styles.statCardTrend}>{t('better_this_week')}</Text>
        </View>
      </View>

      {/* ─── Weekly Summary Card ─── */}
      <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.summaryHeaderRow}>
          <Text style={[styles.summaryTitle, { fontSize: fonts.body, color: colors.textPrimary }]}>
            {t('weekly_summary')}
          </Text>
          <TouchableOpacity onPress={() => onNavigate('insights')} activeOpacity={0.7}>
            <Text style={[styles.viewAllText, { color: accentColor }]}>{t('view_all')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryChartArea}>
          <Svg height="48" width="100%" viewBox="0 0 300 48" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="waveGlow" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={accentColor} stopOpacity="0.35" />
                <Stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
              </LinearGradient>
            </Defs>
            <Path
              d="M 0 32 Q 50 34, 90 20 T 180 18 T 260 26 L 300 24 L 300 48 L 0 48 Z"
              fill="url(#waveGlow)"
            />
            <Path
              d="M 0 32 Q 50 34, 90 20 T 180 18 T 260 26 L 300 24"
              fill="none"
              stroke={accentColor}
              strokeWidth="2.5"
            />
          </Svg>

          <View style={styles.summaryDaysRow}>
            {['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <Text key={day} style={[styles.summaryDayText, { color: colors.textMuted }]}>{day}</Text>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 110,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greetingContainer: {
    flex: 1,
  },
  subGreetingText: {
    fontWeight: '500',
    marginBottom: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userNameText: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  waveEmoji: {
    fontSize: 22,
    marginLeft: 6,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  orbCenterContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  questionText: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: EMOTION_GAP,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  emotionCard: {
    width: EMOTION_WIDTH,
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  emotionEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  emotionLabel: {
    fontWeight: '500',
  },
  sectionTitle: {
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: 12,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  actionBtn: {
    flex: 1,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statsTwoColumnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statCardTitle: {
    fontWeight: '600',
  },
  statCardNumber: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 4,
  },
  statCardSub: {
    fontSize: 11,
  },
  statCardTrend: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '600',
  },
  summaryCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryTitle: {
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  summaryChartArea: {
    width: '100%',
  },
  summaryDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  summaryDayText: {
    fontSize: 11,
    fontWeight: '500',
  },
});