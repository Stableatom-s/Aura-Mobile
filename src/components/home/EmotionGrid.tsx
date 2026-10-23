import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { EMOTIONS } from '@/constants/emotions';
import { EmotionItem } from '@/types';

const { width } = Dimensions.get('window');

interface EmotionGridProps {
  selectedEmotion: string | null;
  onSelectEmotion: (emotionLabel: string) => void;
}

export function EmotionGrid({ selectedEmotion, onSelectEmotion }: EmotionGridProps) {
  return (
    <View style={styles.gridContainer}>
      {EMOTIONS.map((item: EmotionItem) => {
        const active = selectedEmotion === item.label;
        return (
          <TouchableOpacity
            key={item.label}
            onPress={() => onSelectEmotion(item.label)}
            style={[
              styles.emotionCard,
              active && {
                borderColor: '#34D399',
                borderWidth: 1.5,
                backgroundColor: 'rgba(52,211,153,0.15)',
              },
            ]}
            activeOpacity={0.75}
          >
            <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
            <Text style={[styles.emotionLabel, active && { color: '#34D399', fontWeight: '700' }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 10,
  },
  emotionCard: {
    width: (width - 64) / 4,
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  emotionLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    marginTop: 4,
  },
});