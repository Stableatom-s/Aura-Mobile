import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Svg, { Line } from 'react-native-svg';

interface WeeklyChartCardProps {
  onViewAll: () => void;
}

export function WeeklyChartCard({ onViewAll }: WeeklyChartCardProps) {
  const days = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <View style={styles.weeklySummaryCard}>
      <View style={styles.headerRow}>
        <Text style={styles.summaryTitle}>Weekly Summary</Text>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <Svg height="60" width="100%">
        <Line x1="10" y1="45" x2="330" y2="35" stroke="#818CF8" strokeWidth="2.5" />
      </Svg>

      <View style={styles.weekDaysRow}>
        {days.map((day) => (
          <Text key={day} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weeklySummaryCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 14,
  },
  viewAllText: {
    color: '#818CF8',
    fontSize: 12,
    fontWeight: '600',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  weekDayText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
  },
});