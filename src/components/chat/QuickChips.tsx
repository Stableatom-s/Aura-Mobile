import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

interface QuickChipsProps {
  onSelectChip: (text: string) => void;
}

export function QuickChips({ onSelectChip }: QuickChipsProps) {
  const chips = ["I'm feeling stressed", 'Celebrate with me', 'I need advice'];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {chips.map((chip) => (
          <TouchableOpacity
            key={chip}
            style={styles.chipButton}
            onPress={() => onSelectChip(chip)}
            activeOpacity={0.8}
          >
            <Text style={styles.chipButtonText}>{chip}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  chipButton: {
    backgroundColor: 'rgba(129,140,248,0.15)',
    borderColor: 'rgba(129,140,248,0.3)',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  chipButtonText: {
    color: '#C4B5FD',
    fontSize: 12,
  },
});