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
import { LinearGradient } from 'expo-linear-gradient';

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

  const handleExport = () => {
    Alert.alert('Exporting Archive', `Preparing your memories in ${selectedFormat.toUpperCase()} format...`);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Export Memories</Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FORMAT */}
        <Text style={styles.sectionHeader}>FORMAT</Text>
        <View style={styles.formatRow}>
          {FORMATS.map((fmt) => {
            const isSelected = selectedFormat === fmt.id;
            return (
              <TouchableOpacity
                key={fmt.id}
                style={[styles.formatCard, isSelected && styles.formatCardActive]}
                onPress={() => setSelectedFormat(fmt.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.formatTitle, isSelected && styles.formatTitleActive]}>
                  {fmt.title}
                </Text>
                <Text style={styles.formatSub}>{fmt.sub}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* DATE RANGE */}
        <Text style={styles.sectionHeader}>DATE RANGE</Text>
        <View style={styles.rangeCard}>
          {DATE_RANGES.map((range, idx) => {
            const isSelected = selectedRange === range;
            const isLast = idx === DATE_RANGES.length - 1;
            return (
              <TouchableOpacity
                key={range}
                style={[
                  styles.rangeRow,
                  isSelected && styles.rangeRowSelected,
                  !isLast && styles.rangeRowBorder,
                ]}
                onPress={() => setSelectedRange(range)}
                activeOpacity={0.7}
              >
                <Text style={[styles.rangeText, isSelected && styles.rangeTextSelected]}>
                  {range}
                </Text>
                {isSelected && <Check size={16} color="#818CF8" />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* INCLUDES */}
        <View style={styles.includesCard}>
          <Text style={styles.includesHeading}>Includes</Text>
          {INCLUDES_LIST.map((item, i) => (
            <View key={i} style={styles.includeItem}>
              <Check size={14} color="#34D399" />
              <Text style={styles.includeText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* EXPORT BUTTON */}
        <TouchableOpacity activeOpacity={0.85} onPress={handleExport} style={styles.ctaWrapper}>
          <LinearGradient
            colors={['#7C3AED', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Download size={18} color="#FFFFFF" />
            <Text style={styles.ctaText}>Export Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#0A0D18' },
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
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: { fontSize: 20, fontWeight: '800', color: '#F8FAFC' },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionHeader: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  formatRow: { flexDirection: 'row', gap: 10 },
  formatCard: {
    flex: 1,
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 4,
  },
  formatCardActive: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99,102,241,0.18)',
  },
  formatTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: '700' },
  formatTitleActive: { color: '#818CF8' },
  formatSub: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  rangeCard: {
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 18,
  },
  rangeRowSelected: { backgroundColor: 'rgba(99,102,241,0.16)' },
  rangeRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  rangeText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '500' },
  rangeTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  includesCard: {
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 18,
    marginTop: 18,
    gap: 10,
  },
  includesHeading: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  includeItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  includeText: { color: '#F8FAFC', fontSize: 13 },
  ctaWrapper: {
    borderRadius: 22,
    overflow: 'hidden',
    marginTop: 24,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  ctaText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});