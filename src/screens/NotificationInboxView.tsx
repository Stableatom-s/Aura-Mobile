import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeContext';

export interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    icon: '💙',
    title: 'Daily Check-in',
    desc: 'How are you feeling today? Take a moment to reflect on your emotions.',
    time: '9:00 AM',
    unread: true,
  },
  {
    id: '2',
    icon: '🏆',
    title: '14-day Streak!',
    desc: "You've been journaling for 14 days in a row. You're on fire — keep going!",
    time: 'Yesterday',
    unread: true,
  },
  {
    id: '3',
    icon: '📊',
    title: 'Weekly Insight Ready',
    desc: 'Your mood insights for this week are now available in the Insights tab.',
    time: 'Oct 19',
    unread: false,
  },
  {
    id: '4',
    icon: '🌙',
    title: 'Evening Reflection',
    desc: "Don't forget your evening journal entry before bed tonight.",
    time: 'Oct 18',
    unread: false,
  },
  {
    id: '5',
    icon: '✨',
    title: 'Mindfulness Tip',
    desc: "Try the 4-7-8 breathing technique when you're feeling anxious or overwhelmed.",
    time: 'Oct 17',
    unread: false,
  },
  {
    id: '6',
    icon: '💜',
    title: 'Aura is thinking of you',
    desc: "It's been 2 days since we last talked. I'm here whenever you need me.",
    time: 'Oct 16',
    unread: false,
  },
];

export function NotificationInboxView({ onBack }: { onBack: () => void }) {
  const { colors, fonts, accentColor } = useAppTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handlePressItem = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { fontSize: fonts.title, color: colors.textPrimary }]}>
            Notifications
          </Text>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
            <Text style={[styles.markReadText, { fontSize: fonts.caption, color: accentColor }]}>
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* NEW Badge Indicator */}
        {unreadCount > 0 && (
          <Text style={[styles.sectionHeader, { fontSize: fonts.caption, color: colors.textMuted }]}>
            NEW · {unreadCount}
          </Text>
        )}

        <View style={styles.cardsStack}>
          {notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => handlePressItem(item.id)}
              style={[
                styles.notifCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
                item.unread && {
                  backgroundColor: `${accentColor}1A`,
                  borderColor: `${accentColor}4D`,
                },
              ]}
            >
              {/* Icon Square */}
              <View style={[styles.iconSquare, { backgroundColor: colors.background }]}>
                <Text style={styles.iconEmoji}>{item.icon}</Text>
              </View>

              {/* Text Body */}
              <View style={styles.textContainer}>
                <View style={styles.cardTopRow}>
                  <Text style={[styles.cardTitle, { fontSize: fonts.body, color: colors.textPrimary }]}>
                    {item.title}
                  </Text>
                  <View style={styles.timeRow}>
                    <Text style={[styles.timeText, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>
                      {item.time}
                    </Text>
                    {item.unread && (
                      <View style={[styles.unreadDot, { backgroundColor: accentColor }]} />
                    )}
                  </View>
                </View>

                <Text style={[styles.cardDesc, { fontSize: fonts.caption, color: colors.textSecondary }]}>
                  {item.desc}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontWeight: '800',
  },
  markReadText: {
    fontWeight: '600',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 4,
  },
  cardsStack: {
    gap: 10,
  },
  notifCard: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 14,
  },
  iconSquare: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontWeight: '500',
  },
  unreadDot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5,
  },
  cardDesc: {
    lineHeight: 18,
  },
});