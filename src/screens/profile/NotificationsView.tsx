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
import { useAppTheme } from '@/context/ThemeContext';

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
  const { colors, fonts, accentColor } = useAppTheme();
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
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.navBar}>
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

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.cardGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {NOTIFICATION_OPTIONS.map((item, index) => {
            const isLast = index === NOTIFICATION_OPTIONS.length - 1;
            const isEnabled = toggles[item.id];

            return (
              <View
                key={item.id}
                style={[
                  styles.notificationRow,
                  !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
              >
                <View style={styles.textContainer}>
                  <Text style={[styles.titleText, { fontSize: fonts.body, color: colors.textPrimary }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.subtitleText, { fontSize: fonts.caption, color: colors.textSecondary }]}>
                    {item.subtitle}
                  </Text>
                </View>

                {/* Custom smooth toggle */}
                <ToggleSwitch
                  value={isEnabled}
                  onToggle={() => handleToggle(item.id)}
                  
                />
              </View>
            );
          })}
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cardGroup: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  titleText: {
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitleText: {
    lineHeight: 18,
  },
});