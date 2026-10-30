import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Home, MessageCircle, BookOpen, BarChart2, User } from 'lucide-react-native';
import { ScreenState } from '@/types';
import { useAppTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface BottomNavDockProps {
  activeScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
}

export function BottomNavDock({ activeScreen, onNavigate }: BottomNavDockProps) {
  const { colors, fonts, accentColor } = useAppTheme();
  const { t } = useLanguage();

  const tabs = [
    { id: 'home' as ScreenState, icon: Home, label: t('Home') || 'Home' },
    { id: 'chat' as ScreenState, icon: MessageCircle, label: t('Chat') || 'Chat' },
    { id: 'journal' as ScreenState, icon: BookOpen, label: t('Journal') || 'Journal' },
    { id: 'insights' as ScreenState, icon: BarChart2, label: t('Insights') || 'Insights' },
    { id: 'profile' as ScreenState, icon: User, label: t('Profile') || 'Profile' },
  ];

  return (
    <View
      style={[
        styles.dockContainer,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      ]}
    >
      {tabs.map(({ id, icon: Icon, label }) => {
        const active = activeScreen === id;
        const tintColor = active ? accentColor : colors.textMuted;

        return (
          <TouchableOpacity
            key={id}
            style={styles.navItem}
            onPress={() => onNavigate(id)}
            activeOpacity={0.75}
          >
            <Icon size={22} color={tintColor} />
            <Text
              style={[
                styles.navLabel,
                {
                  fontSize: fonts.caption - 1,
                  color: tintColor,
                  fontWeight: active ? '700' : '500',
                },
              ]}
            >
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
    height: Platform.OS === 'ios' ? 76 : 68,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 12 : 4,
  },
  navItem: {
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  navLabel: {
    letterSpacing: -0.2,
  },
});