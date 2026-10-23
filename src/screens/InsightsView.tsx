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

// viewBox dimensions for 100% responsive span
const VB_WIDTH = 600;
const VB_HEIGHT = 180;

// 7 evenly spaced X coordinates spanning from Mon (x=30) to Sun (x=570)
// Step size: (570 - 30) / 6 = 90
const X_COORDS = [30, 120, 210, 300, 390, 480, 570];

// Y values (lower number = higher score on graph)
const MOOD_Y = [95, 115, 60, 80, 40, 58, 75];
const ENERGY_Y = [115, 130, 80, 98, 42, 60, 78];

const MOOD_POINTS = X_COORDS.map((x, i) => ({ x, y: MOOD_Y[i] }));
const ENERGY_POINTS = X_COORDS.map((x, i) => ({ x, y: ENERGY_Y[i] }));

// Smooth cubic Bezier spline covering edge-to-edge
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
  const moodPath = createCurvedPath(MOOD_POINTS);
  const energyPath = createCurvedPath(ENERGY_POINTS);
  const filledAreaPath = `${moodPath} L 570 ${VB_HEIGHT} L 30 ${VB_HEIGHT} Z`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenHeading}>Mood Insights</Text>
      <Text style={styles.screenSub}>Review your emotional trends and personal growth</Text>

      {/* Top 3 Metric Counters */}
      <View style={styles.statsRow}>
        <View style={styles.statMetricCard}>
          <TrendingUp size={16} color="#34D399" />
          <Text style={styles.statMetricValue}>7.8</Text>
          <Text style={styles.statMetricLabel}>Avg Mood</Text>
        </View>
        <View style={styles.statMetricCard}>
          <Flame size={16} color="#FBBF24" />
          <Text style={styles.statMetricValue}>14d</Text>
          <Text style={styles.statMetricLabel}>Streak</Text>
        </View>
        <View style={styles.statMetricCard}>
          <MessageCircle size={16} color="#818CF8" />
          <Text style={styles.statMetricValue}>32</Text>
          <Text style={styles.statMetricLabel}>Sessions</Text>
        </View>
      </View>

      {/* ─── 1. Weekly Mood & Energy Trend Card ─── */}
      <View style={styles.cardBox}>
        <Text style={styles.cardHeaderTitle}>Weekly Mood Trend</Text>

        <View style={styles.chartWrapper}>
          {/* Y-Axis scale labels */}
          <View style={styles.yAxisLabels}>
            <Text style={styles.axisText}>10</Text>
            <Text style={styles.axisText}>6</Text>
            <Text style={styles.axisText}>3</Text>
            <Text style={styles.axisText}>0</Text>
          </View>

          {/* SVG Canvas stretching across the full container */}
          <View style={styles.svgContainer}>
            <Svg
              height="150"
              width="100%"
              viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
              preserveAspectRatio="none"
            >
              <Defs>
                <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
                  <Stop offset="55%" stopColor="#38BDF8" stopOpacity="0.12" />
                  <Stop offset="100%" stopColor="#0B0F19" stopOpacity="0" />
                </LinearGradient>
              </Defs>

              {/* Shaded Area Below Line */}
              <Path d={filledAreaPath} fill="url(#chartGradient)" />

              {/* Energy Trajectory (Cyan-Green Curve) */}
              <Path
                d={energyPath}
                fill="none"
                stroke="#34D399"
                strokeWidth="3.2"
              />

              {/* Mood Trajectory (Indigo-Purple Curve) */}
              <Path
                d={moodPath}
                fill="none"
                stroke="#818CF8"
                strokeWidth="3.8"
              />

              {/* Circular Data Nodes on Mood Line */}
              {MOOD_POINTS.map((pt, idx) => (
                <SvgCircle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="7.5"
                  fill="#C7D2FE"
                  stroke="#6366F1"
                  strokeWidth="3.5"
                />
              ))}
            </Svg>

            {/* Bottom X-Axis Days aligned with points */}
            <View style={styles.xAxisRow}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <View key={day} style={styles.xDayCol}>
                  <Text style={styles.xDayLabel}>{day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#818CF8' }]} />
            <Text style={styles.legendText}>Mood</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#34D399' }]} />
            <Text style={styles.legendText}>Energy</Text>
          </View>
        </View>
      </View>

      {/* ─── 2. Stress Levels Bar Card ─── */}
      <View style={styles.cardBox}>
        <Text style={styles.cardHeaderTitle}>Stress Levels</Text>
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
              <Text style={styles.barDayText}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ─── 3. Personal Growth Score Card ─── */}
      <View style={styles.growthCardBox}>
        <View style={{ flex: 1 }}>
          <Text style={styles.growthTitle}>Personal Growth Score</Text>
          <Text style={styles.growthScoreBig}>82</Text>
          <Text style={styles.growthDelta}>↑ 6 points this month</Text>
        </View>
        <View style={styles.awardCircleOuter}>
          <View style={styles.awardCircleInner}>
            <Award size={26} color="#A78BFA" strokeWidth={2.2} />
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
    paddingTop: 10,
    paddingBottom: 110,
  },
  screenHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  screenSub: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 13,
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
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 4,
  },
  statMetricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  statMetricLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  cardBox: {
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 14,
  },
  cardHeaderTitle: {
    color: '#F8FAFC',
    fontSize: 16,
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
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 11,
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
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
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
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12,
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
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    marginTop: 8,
    fontWeight: '500',
  },
  growthCardBox: {
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  growthTitle: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  growthScoreBig: {
    fontSize: 38,
    fontWeight: '900',
    color: '#818CF8',
    letterSpacing: -0.5,
  },
  growthDelta: {
    color: '#34D399',
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 4,
  },
  awardCircleOuter: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(129, 140, 248, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  awardCircleInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(129, 140, 248, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(129, 140, 248, 0.4)',
  },
});