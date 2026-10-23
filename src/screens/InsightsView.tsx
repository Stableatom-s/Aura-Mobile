import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { TrendingUp, Flame, MessageCircle, Calendar } from 'lucide-react-native';
import Svg, { Line, Circle as SvgCircle } from 'react-native-svg';

const WEEKLY_DATA = [
  { day: 'Mon', score: 6.5, x: 25, y: 55 },
  { day: 'Tue', score: 7.0, x: 75, y: 48 },
  { day: 'Wed', score: 8.5, x: 130, y: 22 },
  { day: 'Thu', score: 7.2, x: 185, y: 44 },
  { day: 'Fri', score: 8.0, x: 240, y: 30 },
  { day: 'Sat', score: 9.0, x: 295, y: 15 },
  { day: 'Sun', score: 7.8, x: 345, y: 34 },
];

const EMOTION_BREAKDOWN = [
  { emoji: '😊', label: 'Happy', count: 18, pct: '45%', color: '#34D399' },
  { emoji: '😌', label: 'Calm', count: 12, pct: '30%', color: '#818CF8' },
  { emoji: '😰', label: 'Anxious', count: 6, pct: '15%', color: '#FBBF24' },
  { emoji: '😔', label: 'Sad', count: 4, pct: '10%', color: '#94A3B8' },
];

export function InsightsView() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenHeading}>Mood Insights</Text>
      <Text style={styles.screenSub}>Review your emotional trends over time</Text>

      {/* Top 3 Metric Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <TrendingUp size={16} color="#34D399" />
          <Text style={styles.statValue}>7.8</Text>
          <Text style={styles.statLabel}>Avg Mood</Text>
        </View>
        <View style={styles.statCard}>
          <Flame size={16} color="#FBBF24" />
          <Text style={styles.statValue}>14d</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <View style={styles.statCard}>
          <MessageCircle size={16} color="#818CF8" />
          <Text style={styles.statValue}>32</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
      </View>

      {/* Weekly Mood Trend Chart */}
      <View style={styles.cardBox}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Weekly Mood Trajectory</Text>
          <View style={styles.tagBadge}>
            <Calendar size={12} color="#818CF8" />
            <Text style={styles.tagText}>Last 7 Days</Text>
          </View>
        </View>

        <View style={{ height: 110, justifyContent: 'center' }}>
          <Svg height="90" width="100%" viewBox="0 0 370 80">
            {/* Trend Connecting Line */}
            <Line x1="25" y1="55" x2="75" y2="48" stroke="#818CF8" strokeWidth="2.5" />
            <Line x1="75" y1="48" x2="130" y2="22" stroke="#818CF8" strokeWidth="2.5" />
            <Line x1="130" y1="22" x2="185" y2="44" stroke="#818CF8" strokeWidth="2.5" />
            <Line x1="185" y1="44" x2="240" y2="30" stroke="#818CF8" strokeWidth="2.5" />
            <Line x1="240" y1="30" x2="295" y2="15" stroke="#818CF8" strokeWidth="2.5" />
            <Line x1="295" y1="15" x2="345" y2="34" stroke="#818CF8" strokeWidth="2.5" />

            {/* Data Point Nodes */}
            {WEEKLY_DATA.map((pt, i) => (
              <SvgCircle key={i} cx={pt.x} cy={pt.y} r="4.5" fill="#6366F1" stroke="#FFFFFF" strokeWidth="1.5" />
            ))}
          </Svg>
        </View>

        <View style={styles.dayLabelsRow}>
          {WEEKLY_DATA.map((item) => (
            <Text key={item.day} style={styles.dayLabelText}>{item.day}</Text>
          ))}
        </View>
      </View>

      {/* Emotion Distribution */}
      <Text style={styles.sectionTitle}>EMOTION DISTRIBUTION</Text>
      <View style={styles.cardBox}>
        {EMOTION_BREAKDOWN.map((item) => (
          <View key={item.label} style={styles.breakdownRow}>
            <Text style={{ fontSize: 18, width: 28 }}>{item.emoji}</Text>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={styles.breakdownLabel}>{item.label}</Text>
                <Text style={styles.breakdownCount}>{item.count} times</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: item.pct as any, backgroundColor: item.color }]} />
              </View>
            </View>
            <Text style={styles.breakdownPct}>{item.pct}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  screenHeading: { fontSize: 26, fontWeight: '800', color: '#F8FAFC' },
  screenSub: { color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: 16, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 4,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#F8FAFC' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  cardBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '700' },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(129,140,248,0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  tagText: { color: '#C4B5FD', fontSize: 10, fontWeight: '600' },
  dayLabelsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, marginTop: 6 },
  dayLabelText: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
  sectionTitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    fontWeight: '700',
  },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  breakdownLabel: { color: '#F8FAFC', fontSize: 13, fontWeight: '600' },
  breakdownCount: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 3 },
  breakdownPct: { color: 'rgba(255,255,255,0.5)', fontSize: 12, width: 34, textAlign: 'right' },
});