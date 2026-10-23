import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MessageCircle, Mic, BookOpen, Wind } from 'lucide-react-native';
import { ScreenState } from '@/types';

interface QuickActionsProps {
  onNavigate: (screen: ScreenState) => void;
}

export function QuickActions({ onNavigate }: QuickActionsProps) {
  const actions = [
    { label: 'Talk', icon: MessageCircle, bg: '#818CF8', target: 'chat' as ScreenState },
    { label: 'Voice', icon: Mic, bg: '#EC4899', target: 'voice' as ScreenState },
    { label: 'Journal', icon: BookOpen, bg: '#8B5CF6', target: 'journal' as ScreenState },
    { label: 'Meditate', icon: Wind, bg: '#38BDF8', target: 'meditate' as ScreenState },
  ];

  return (
    <View style={styles.actionRow}>
      {actions.map(({ label, icon: Icon, bg, target }) => (
        <TouchableOpacity
          key={label}
          style={[styles.actionBtn, { backgroundColor: bg }]}
          onPress={() => onNavigate(target)}
          activeOpacity={0.8}
        >
          <Icon size={20} color="#fff" />
          <Text style={styles.actionBtnText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});