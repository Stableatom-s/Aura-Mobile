import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function GradientButton({ label, onPress, disabled, icon, style }: GradientButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.buttonWrapper, style, disabled && { opacity: 0.5 }]}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={styles.label}>{label}</Text>
        {icon}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 26,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});