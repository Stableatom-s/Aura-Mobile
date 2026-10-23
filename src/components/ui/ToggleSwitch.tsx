import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ToggleSwitchProps {
  value: boolean;
  onToggle: () => void;
}

export function ToggleSwitch({ value, onToggle }: ToggleSwitchProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[styles.track, value && styles.trackActive]}
      activeOpacity={0.8}
    >
      <View style={[styles.knob, value && styles.knobActive]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 2,
    justifyContent: 'center',
  },
  trackActive: {
    backgroundColor: '#818CF8',
  },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  knobActive: {
    transform: [{ translateX: 20 }],
  },
});