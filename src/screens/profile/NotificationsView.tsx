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
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';

interface NotificationOption {
  id: string;
  title: string;
  subtitle: string;
  initialValue: boolean;
}

const NOTIFICATION_OPTIONS: NotificationOption[] = [
  {
    id: 'daily_checkin',
    title: 'Daily Check-in',
    subtitle: 'Morning reminder to log your mood',
    initialValue: true,
  },
  {
    id: 'mood_reminders',
    title: 'Mood Reminders',
    subtitle: 'Gentle nudges throughout the day',
    initialValue: true,
  },
  {
    id: 'achievements',
    title: 'Achievements',
    subtitle: 'Celebrate your milestones',
    initialValue: true,
  },
  {
    id: 'weekly_insights',
    title: 'Weekly Insights',
    subtitle: 'Summary of your emotional patterns',
    initialValue: false,
  },
  {
    id: 'meditation_reminder',
    title: 'Meditation Reminder',
    subtitle: 'Daily mindfulness nudge',
    initialValue: false,
  },
  {
    id: 'streak_alerts',
    title: 'Streak Alerts',
    subtitle: 'Keep your journaling streak alive',
    initialValue: true,
  },
];

export function NotificationsView({ onBack }: { onBack: () => void }) {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    NOTIFICATION_OPTIONS.reduce(
      (acc, curr) => ({ ...acc, [curr.id]: curr.initialValue }),
      {}
    )
  );

  const handleToggle = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Header */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Notifications</Text>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {NOTIFICATION_OPTIONS.map((item, index) => {
          const isLast = index === NOTIFICATION_OPTIONS.length - 1;
          const isEnabled = toggles[item.id];

          return (
            <View
              key={item.id}
              style={[styles.notificationRow, !isLast && styles.rowDivider]}
            >
              <View style={styles.textContainer}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.subtitleText}>{item.subtitle}</Text>
              </View>

              {/* Custom smooth toggle */}
              <ToggleSwitch
                value={isEnabled}
                onToggle={() => handleToggle(item.id)}
              />
            </View>
          );
        })}
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.4)',
    lineHeight: 18,
  },
});