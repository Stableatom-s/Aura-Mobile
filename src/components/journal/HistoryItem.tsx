import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { JournalRecord } from '@/types';

interface HistoryItemProps {
  entry: JournalRecord;
}

export function HistoryItem({ entry }: HistoryItemProps) {
  return (
    <View style={styles.historyJournalCard}>
      <View style={styles.topRow}>
        <Text style={styles.historyDateText}>{entry.date}</Text>
        <Text style={styles.historyWordCount}>{entry.words} words</Text>
      </View>
      <Text style={styles.historyCardTitle}>{entry.title}</Text>
      <Text style={styles.historyCardPreview}>{entry.preview}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  historyJournalCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  historyDateText: {
    color: '#818CF8',
    fontSize: 11,
  },
  historyWordCount: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
  },
  historyCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  historyCardPreview: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 18,
  },
});