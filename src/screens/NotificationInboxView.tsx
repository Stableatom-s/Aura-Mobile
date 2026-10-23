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
    <SafeAreaView style={styles.safeContainer}>
      {/* Header */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Notifications</Text>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
            <Text style={styles.markReadText}>Mark all read</Text>
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
          <Text style={styles.sectionHeader}>NEW · {unreadCount}</Text>
        )}

        <View style={styles.cardsStack}>
          {notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => handlePressItem(item.id)}
              style={[styles.notifCard, item.unread && styles.notifCardUnread]}
            >
              {/* Icon Square */}
              <View style={styles.iconSquare}>
                <Text style={styles.iconEmoji}>{item.icon}</Text>
              </View>

              {/* Text Body */}
              <View style={styles.textContainer}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={styles.timeRow}>
                    <Text style={styles.timeText}>{item.time}</Text>
                    {item.unread && <View style={styles.unreadDot} />}
                  </View>
                </View>

                <Text style={styles.cardDesc}>{item.desc}</Text>
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
    backgroundColor: '#0A0D18',
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
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  markReadText: {
    color: '#818CF8',
    fontSize: 13,
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
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 11,
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
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 14,
  },
  notifCardUnread: {
    backgroundColor: 'rgba(30, 27, 75, 0.65)',
    borderColor: 'rgba(129, 140, 248, 0.25)',
  },
  iconSquare: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 11,
    fontWeight: '500',
  },
  unreadDot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5,
    backgroundColor: '#818CF8',
  },
  cardDesc: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12.5,
    lineHeight: 18,
  },
});