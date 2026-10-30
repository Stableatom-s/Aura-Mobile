import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle as SvgCircle,
} from 'react-native-svg';
import { Award, TrendingUp, Flame, MessageCircle } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeContext';

const VB_WIDTH = 600;
const VB_HEIGHT = 180;
const X_COORDS = [30, 120, 210, 300, 390, 480, 570];
const MOOD_Y = [95, 115, 60, 80, 40, 58, 75];
const ENERGY_Y = [115, 130, 80, 98, 42, 60, 78];

const MOOD_POINTS = X_COORDS.map((x, i) => ({ x, y: MOOD_Y[i] }));
const ENERGY_POINTS = X_COORDS.map((x, i) => ({ x, y: ENERGY_Y[i] }));

const createCurvedPath = (points: { x: number; y: number }[]) => {
  return points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, '');
};

const STRESS_DATA = [
  { day: 'Mon', height: 75, color: '#F87171' },
  { day: 'Tue', height: 95, color: '#F87171' },
  { day: 'Wed', height: 50, color: '#34D399' },
  { day: 'Thu', height: 68, color: '#FBBF24' },
  { day: 'Fri', height: 30, color: '#34D399' },
  { day: 'Sat', height: 42, color: '#34D399' },
  { day: 'Sun', height: 52, color: '#34D399' },
];

export function InsightsView() {
  const { colors, fonts, accentColor } = useAppTheme();
  const moodPath = createCurvedPath(MOOD_POINTS);
  const energyPath = createCurvedPath(ENERGY_POINTS);
  const filledAreaPath = `${moodPath} L 570 ${VB_HEIGHT} L 30 ${VB_HEIGHT} Z`;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.screenHeading, { fontSize: fonts.header, color: colors.textPrimary }]}>
        Mood Insights
      </Text>
      <Text style={[styles.screenSub, { fontSize: fonts.caption, color: colors.textMuted }]}>
        Review your emotional trends and personal growth
      </Text>

      {/* Top 3 Metric Counters */}
      <View style={styles.statsRow}>
        <View style={[styles.statMetricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TrendingUp size={16} color="#34D399" />
          <Text style={[styles.statMetricValue, { fontSize: fonts.title, color: colors.textPrimary }]}>7.8</Text>
          <Text style={[styles.statMetricLabel, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>
            Avg Mood
          </Text>
        </View>
        <View style={[styles.statMetricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Flame size={16} color="#FBBF24" />
          <Text style={[styles.statMetricValue, { fontSize: fonts.title, color: colors.textPrimary }]}>14d</Text>
          <Text style={[styles.statMetricLabel, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>
            Streak
          </Text>
        </View>
        <View style={[styles.statMetricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MessageCircle size={16} color={accentColor} />
          <Text style={[styles.statMetricValue, { fontSize: fonts.title, color: colors.textPrimary }]}>32</Text>
          <Text style={[styles.statMetricLabel, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>
            Sessions
          </Text>
        </View>
      </View>

      {/* ─── 1. Weekly Mood Trend Card ─── */}
      <View style={[styles.cardBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardHeaderTitle, { fontSize: fonts.subheading, color: colors.textPrimary }]}>
          Weekly Mood Trend
        </Text>

        <View style={styles.chartWrapper}>
          <View style={styles.yAxisLabels}>
            <Text style={[styles.axisText, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>10</Text>
            <Text style={[styles.axisText, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>6</Text>
            <Text style={[styles.axisText, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>3</Text>
            <Text style={[styles.axisText, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>0</Text>
          </View>

          <View style={styles.svgContainer}>
            <Svg
              height="150"
              width="100%"
              viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
              preserveAspectRatio="none"
            >
              <Defs>
                <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={accentColor} stopOpacity="0.35" />
                  <Stop offset="55%" stopColor={accentColor} stopOpacity="0.12" />
                  <Stop offset="100%" stopColor={colors.background} stopOpacity="0" />
                </LinearGradient>
              </Defs>

              <Path d={filledAreaPath} fill="url(#chartGradient)" />
              <Path d={energyPath} fill="none" stroke="#34D399" strokeWidth="3.2" />
              <Path d={moodPath} fill="none" stroke={accentColor} strokeWidth="3.8" />

              {MOOD_POINTS.map((pt, idx) => (
                <SvgCircle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="7.5"
                  fill="#FFFFFF"
                  stroke={accentColor}
                  strokeWidth="3.5"
                />
              ))}
            </Svg>

            <View style={styles.xAxisRow}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <View key={day} style={styles.xDayCol}>
                  <Text style={[styles.xDayLabel, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: accentColor }]} />
            <Text style={[styles.legendText, { fontSize: fonts.caption, color: colors.textSecondary }]}>Mood</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#34D399' }]} />
            <Text style={[styles.legendText, { fontSize: fonts.caption, color: colors.textSecondary }]}>Energy</Text>
          </View>
        </View>
      </View>

      {/* ─── 2. Stress Levels Bar Card ─── */}
      <View style={[styles.cardBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardHeaderTitle, { fontSize: fonts.subheading, color: colors.textPrimary }]}>
          Stress Levels
        </Text>
        <View style={styles.barChartContainer}>
          {STRESS_DATA.map((item) => (
            <View key={item.day} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: item.height, backgroundColor: item.color },
                  ]}
                />
              </View>
              <Text style={[styles.barDayText, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>
                {item.day}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ─── 3. Personal Growth Score Card ─── */}
      <View style={[styles.growthCardBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.growthTitle, { fontSize: fonts.caption, color: colors.textSecondary }]}>
            Personal Growth Score
          </Text>
          <Text style={[styles.growthScoreBig, { fontSize: fonts.header + 12, color: accentColor }]}>82</Text>
          <Text style={[styles.growthDelta, { fontSize: fonts.caption }]}>↑ 6 points this month</Text>
        </View>
        <View style={[styles.awardCircleOuter, { backgroundColor: `${accentColor}1A` }]}>
          <View style={[styles.awardCircleInner, { backgroundColor: `${accentColor}2A`, borderColor: accentColor }]}>
            <Award size={26} color={accentColor} strokeWidth={2.2} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },
  screenHeading: {
    fontWeight: '800',
  },
  screenSub: {
    marginBottom: 16,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statMetricCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 4,
  },
  statMetricValue: {
    fontWeight: '800',
  },
  statMetricLabel: {},
  cardBox: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  cardHeaderTitle: {
    fontWeight: '700',
    marginBottom: 12,
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    height: 120,
    paddingRight: 8,
    paddingTop: 4,
  },
  axisText: {
    fontWeight: '500',
  },
  svgContainer: {
    flex: 1,
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 6,
  },
  xDayCol: {
    alignItems: 'center',
    width: 32,
  },
  xDayLabel: {
    fontWeight: '500',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginTop: 18,
    paddingLeft: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontWeight: '500',
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 130,
    paddingTop: 10,
    paddingHorizontal: 6,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  barFill: {
    width: 28,
    borderRadius: 8,
  },
  barDayText: {
    marginTop: 8,
    fontWeight: '500',
  },
  growthCardBox: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  growthTitle: {
    fontWeight: '600',
    marginBottom: 6,
  },
  growthScoreBig: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  growthDelta: {
    color: '#34D399',
    fontWeight: '600',
    marginTop: 4,
  },
  awardCircleOuter: {
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
  },
  awardCircleInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
});