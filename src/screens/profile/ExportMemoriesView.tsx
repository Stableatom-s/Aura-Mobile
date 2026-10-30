import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { ChevronLeft, Download, Check } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeContext';

const FORMATS = [
  { id: 'pdf', title: 'PDF', sub: 'Formatted report' },
  { id: 'json', title: 'JSON', sub: 'Raw data' },
  { id: 'csv', title: 'CSV', sub: 'Spreadsheet' },
];

const DATE_RANGES = ['Last 7 days', 'Last 30 days', 'Last 3 months', 'All time'];

const INCLUDES_LIST = [
  'Journal entries',
  'Mood history',
  'Chat conversations',
  'Voice transcripts',
  'Insights data',
];

export function ExportMemoriesView({ onBack }: { onBack: () => void }) {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedRange, setSelectedRange] = useState('All time');
  const { colors, fonts, accentColor } = useAppTheme();

  const handleExport = () => {
    Alert.alert('Exporting Archive', `Preparing your memories in ${selectedFormat.toUpperCase()} format...`);
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { fontSize: fonts.title, color: colors.textPrimary }]}>
          Export Memories
        </Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FORMAT */}
        <Text style={[styles.sectionHeader, { fontSize: fonts.caption, color: colors.textMuted }]}>
          FORMAT
        </Text>
        <View style={styles.formatRow}>
          {FORMATS.map((fmt) => {
            const isSelected = selectedFormat === fmt.id;
            return (
              <TouchableOpacity
                key={fmt.id}
                style={[
                  styles.formatCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  isSelected && {
                    borderColor: accentColor,
                    backgroundColor: `${accentColor}1A`,
                  },
                ]}
                onPress={() => setSelectedFormat(fmt.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.formatTitle,
                    { fontSize: fonts.subheading, color: isSelected ? accentColor : colors.textPrimary },
                  ]}
                >
                  {fmt.title}
                </Text>
                <Text style={[styles.formatSub, { fontSize: fonts.caption, color: colors.textMuted }]}>
                  {fmt.sub}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* DATE RANGE */}
        <Text style={[styles.sectionHeader, { fontSize: fonts.caption, color: colors.textMuted }]}>
          DATE RANGE
        </Text>
        <View style={[styles.rangeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {DATE_RANGES.map((range, idx) => {
            const isSelected = selectedRange === range;
            const isLast = idx === DATE_RANGES.length - 1;
            return (
              <TouchableOpacity
                key={range}
                style={[
                  styles.rangeRow,
                  isSelected && { backgroundColor: `${accentColor}14` },
                  !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
                onPress={() => setSelectedRange(range)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.rangeText,
                    {
                      fontSize: fonts.body,
                      color: isSelected ? colors.textPrimary : colors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {range}
                </Text>
                {isSelected && <Check size={16} color={accentColor} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* INCLUDES */}
        <View style={[styles.includesCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.includesHeading, { fontSize: fonts.caption, color: colors.textMuted }]}>
            Includes
          </Text>
          {INCLUDES_LIST.map((item, i) => (
            <View key={i} style={styles.includeItem}>
              <Check size={14} color="#10B981" />
              <Text style={[styles.includeText, { fontSize: fonts.body, color: colors.textPrimary }]}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        {/* EXPORT BUTTON */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleExport}
          style={[styles.ctaButton, { backgroundColor: accentColor, shadowColor: accentColor }]}
        >
          <Download size={18} color="#FFFFFF" />
          <Text style={[styles.ctaText, { fontSize: fonts.body }]}>Export Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
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
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: { fontWeight: '800' },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionHeader: {
    letterSpacing: 1.5,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  formatRow: { flexDirection: 'row', gap: 10 },
  formatCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    gap: 4,
  },
  formatTitle: { fontWeight: '700' },
  formatSub: { fontWeight: '500' },
  rangeCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 18,
  },
  rangeText: {},
  includesCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginTop: 18,
    gap: 10,
  },
  includesHeading: { fontWeight: '700', marginBottom: 2, letterSpacing: 1 },
  includeItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  includeText: {},
  ctaButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    paddingVertical: 16,
    marginTop: 24,
    gap: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  ctaText: { color: '#FFFFFF', fontWeight: '700' },
});