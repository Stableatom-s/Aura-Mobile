import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Home, MessageCircle, BookOpen, BarChart2, User } from 'lucide-react-native';
import { ScreenState } from '@/types';

interface BottomNavDockProps {
  activeScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
}

export function BottomNavDock({ activeScreen, onNavigate }: BottomNavDockProps) {
  const tabs = [
    { id: 'home' as ScreenState, icon: Home, label: 'Home' },
    { id: 'chat' as ScreenState, icon: MessageCircle, label: 'Chat' },
    { id: 'journal' as ScreenState, icon: BookOpen, label: 'Journal' },
    { id: 'insights' as ScreenState, icon: BarChart2, label: 'Insights' },
    { id: 'profile' as ScreenState, icon: User, label: 'Profile' },
  ];

  return (
    <View style={styles.dockContainer}>
      {tabs.map(({ id, icon: Icon, label }) => {
        const active = activeScreen === id;
        return (
          <TouchableOpacity
            key={id}
            style={styles.navItem}
            onPress={() => onNavigate(id)}
          >
            <Icon size={22} color={active ? '#818CF8' : 'rgba(255, 255, 255, 0.4)'} />
            <Text style={[styles.navLabel, { color: active ? '#818CF8' : 'rgba(255, 255, 255, 0.4)' }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dockContainer: {
    flexDirection: 'row',
    height: 68,
    backgroundColor: '#0B0F19',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  navItem: {
    alignItems: 'center',
    gap: 3,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});