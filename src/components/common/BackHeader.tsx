import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

interface BackHeaderProps {
  title: string;
  onBack: () => void;
}

export function BackHeader({ title, onBack }: BackHeaderProps) {
  return (
    <View style={styles.headerBar}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <ChevronLeft size={20} color="#F8FAFC" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
});