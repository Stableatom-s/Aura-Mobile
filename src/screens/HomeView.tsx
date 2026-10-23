import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { MessageSquare, Mic, BookOpen, Wind, Flame, TrendingUp } from 'lucide-react-native';
import { GlowingOrb } from '@/components/common/GlowingOrb';
import { ScreenState } from '@/types';

const { width } = Dimensions.get('window');
const EMOTION_GAP = 8;
const EMOTION_WIDTH = (width - 40 - EMOTION_GAP * 3) / 4;

interface EmotionItem {
  id: string;
  label: string;
  emoji: string;
  color: string;
  glowBg: string;
}

const EMOTIONS: EmotionItem[] = [
  { id: 'Happy', label: 'Happy', emoji: '😊', color: '#10B981', glowBg: 'rgba(16, 185, 129, 0.16)' },
  { id: 'Sad', label: 'Sad', emoji: '😔', color: '#60A5FA', glowBg: 'rgba(96, 165, 250, 0.16)' },
  { id: 'Angry', label: 'Angry', emoji: '😡', color: '#EF4444', glowBg: 'rgba(239, 68, 68, 0.16)' },
  { id: 'Calm', label: 'Calm', emoji: '😌', color: '#38BDF8', glowBg: 'rgba(56, 189, 248, 0.16)' },
  { id: 'Anxious', label: 'Anxious', emoji: '😰', color: '#F59E0B', glowBg: 'rgba(245, 158, 11, 0.16)' },
  { id: 'Tired', label: 'Tired', emoji: '🥱', color: '#A78BFA', glowBg: 'rgba(167, 139, 250, 0.16)' },
  { id: 'Loved', label: 'Loved', emoji: '❤️', color: '#F43F5E', glowBg: 'rgba(244, 63, 94, 0.16)' },
  { id: 'Confused', label: 'Confused', emoji: '🤔', color: '#FBBF24', glowBg: 'rgba(251, 191, 36, 0.16)' },
];

interface HomeViewProps {
  userName?: string;
  streak?: number;
  selectedEmotion: string | null;
  onSelectEmotion: (emotion: string) => void;
  onNavigate: (screen: ScreenState) => void;
}

export function HomeView({
  userName = 'Tanmay',
  streak = 14,
  selectedEmotion = 'Sad',
  onSelectEmotion,
  onNavigate,
}: HomeViewProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Top Left User Greeting ─── */}
      <View style={styles.headerRow}>
        <Text style={styles.userNameText}>{userName} 👋</Text>
      </View>

      {/* ─── Center Glowing Orb ─── */}
      <View style={styles.orbCenterContainer}>
        <GlowingOrb size={68} />
      </View>

      {/* ─── Question ─── */}
      <Text style={styles.questionText}>How are you feeling today?</Text>

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
                  isSelected && { color: item.color, fontWeight: '700' },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ─── Quick Actions ─── */}
      <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
      <View style={styles.quickActionsRow}>
        {/* Talk */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#818CF8' }]}
          onPress={() => onNavigate('chat')}
          activeOpacity={0.8}
        >
          <MessageSquare size={18} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Talk</Text>
        </TouchableOpacity>

        {/* Voice */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#EC4899' }]}
          onPress={() => onNavigate('chat')}
          activeOpacity={0.8}
        >
          <Mic size={18} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Voice</Text>
        </TouchableOpacity>

        {/* Journal */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#8B5CF6' }]}
          onPress={() => onNavigate('journal')}
          activeOpacity={0.8}
        >
          <BookOpen size={18} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Journal</Text>
        </TouchableOpacity>

        {/* Meditate */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#38BDF8' }]}
          onPress={() => onNavigate('meditate')}
          activeOpacity={0.8}
        >
          <Wind size={18} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Meditate</Text>
        </TouchableOpacity>
      </View>

      {/* ─── 2 Metric Stat Cards ─── */}
      <View style={styles.statsTwoColumnRow}>
        {/* Streak Card */}
        <View style={styles.statCard}>
          <View style={styles.statCardHeader}>
            <Flame size={15} color="#FBBF24" />
            <Text style={styles.statCardTitle}>Streak</Text>
          </View>
          <Text style={styles.statCardNumber}>{streak}</Text>
          <Text style={styles.statCardSub}>days in a row</Text>
        </View>

        {/* Avg Mood Card */}
        <View style={styles.statCard}>
          <View style={styles.statCardHeader}>
            <TrendingUp size={15} color="#34D399" />
            <Text style={styles.statCardTitle}>Avg Mood</Text>
          </View>
          <Text style={styles.statCardNumber}>7.8</Text>
          <Text style={styles.statCardTrend}>↑ Better this week</Text>
        </View>
      </View>

      {/* ─── Weekly Summary Card ─── */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeaderRow}>
          <Text style={styles.summaryTitle}>Weekly Summary</Text>
          <TouchableOpacity onPress={() => onNavigate('insights')} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryChartArea}>
          <Svg height="48" width="100%" viewBox="0 0 300 48" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="waveGlow" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#818CF8" stopOpacity="0.35" />
                <Stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
              </LinearGradient>
            </Defs>
            <Path
              d="M 0 32 Q 50 34, 90 20 T 180 18 T 260 26 L 300 24 L 300 48 L 0 48 Z"
              fill="url(#waveGlow)"
            />
            <Path
              d="M 0 32 Q 50 34, 90 20 T 180 18 T 260 26 L 300 24"
              fill="none"
              stroke="#818CF8"
              strokeWidth="2.5"
            />
          </Svg>

          <View style={styles.summaryDaysRow}>
            {['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <Text key={day} style={styles.summaryDayText}>{day}</Text>
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
    backgroundColor: '#0A0D18',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
  },
  headerRow: {
    marginBottom: 6,
  },
  userNameText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  orbCenterContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  questionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.65)',
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
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  emotionEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  emotionLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 11,
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
    fontSize: 12,
    fontWeight: '700',
  },
  statsTwoColumnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statCardTitle: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12,
    fontWeight: '600',
  },
  statCardNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  statCardSub: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
  },
  statCardTrend: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#818CF8',
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
    color: 'rgba(255, 255, 255, 0.35)',
    fontWeight: '500',
  },
});