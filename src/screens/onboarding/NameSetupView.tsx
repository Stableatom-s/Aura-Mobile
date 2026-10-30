import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const CURRENT_YEAR = 2026;
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);

interface NameSetupViewProps {
  onBack?: () => void;
  onNext: (name: string, birthday?: string) => void;
  initialName?: string;
  authProvider?: 'google' | 'apple' | 'guest';
}

export function NameSetupView({
  onNext,
  initialName = '',
  authProvider = 'google',
}: NameSetupViewProps) {
  const { colors, fonts, accentColor } = useAppTheme();

  const [displayName, setDisplayName] = useState(initialName);
  const [selectedMonth, setSelectedMonth] = useState(8); // September
  const [selectedDay, setSelectedDay] = useState(4);
  const [selectedYear, setSelectedYear] = useState(2000);
  const [hasSelectedBirthday, setHasSelectedBirthday] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [tempMonth, setTempMonth] = useState(selectedMonth);
  const [tempDay, setTempDay] = useState(selectedDay);
  const [tempYear, setTempYear] = useState(selectedYear);

  const monthScrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const dayScrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const yearScrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  useEffect(() => {
    if (showDatePicker) {
      setTimeout(() => {
        monthScrollRef.current?.scrollTo({ y: tempMonth * ITEM_HEIGHT, animated: false });
        dayScrollRef.current?.scrollTo({ y: (tempDay - 1) * ITEM_HEIGHT, animated: false });
        const yearIdx = YEARS.indexOf(tempYear);
        if (yearIdx >= 0) {
          yearScrollRef.current?.scrollTo({ y: yearIdx * ITEM_HEIGHT, animated: false });
        }
      }, 50);
    }
  }, [showDatePicker]);

  const handleScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    setter: (val: number) => void,
    offsetAdjustment = 0
  ) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    setter(index + offsetAdjustment);
  };

  const formattedDate = `${MONTHS[selectedMonth]} ${selectedDay}, ${selectedYear}`;

  const handleConfirmDate = () => {
    setSelectedMonth(tempMonth);
    setSelectedDay(tempDay);
    setSelectedYear(tempYear);
    setHasSelectedBirthday(true);
    setShowDatePicker(false);
  };

  const handleContinue = () => {
    const trimmed = displayName.trim() || initialName;
    const bdayString = hasSelectedBirthday ? formattedDate : undefined;
    onNext(trimmed, bdayString);
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.topContent}>
          {/* Top Dynamic Auth Provider Badge */}
          <View
            style={[
              styles.avatarBadge,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {authProvider === 'apple' ? (
              <Ionicons name="logo-apple" size={22} color={colors.textPrimary} />
            ) : authProvider === 'google' ? (
              <Text style={[styles.avatarText, { color: colors.textPrimary }]}>G</Text>
            ) : (
              <Ionicons name="person-outline" size={20} color={colors.textPrimary} />
            )}
          </View>

          {/* Heading and Description */}
          <Text
            style={[
              styles.title,
              { fontSize: fonts.header, color: colors.textPrimary },
            ]}
          >
            What should we call you?
          </Text>
          <Text
            style={[
              styles.subtitle,
              { fontSize: fonts.body, color: colors.textSecondary },
            ]}
          >
            {authProvider === 'apple'
              ? 'Your name from Apple is pre-filled. Feel free to change it.'
              : authProvider === 'google'
                ? 'Your name from Google is pre-filled. Feel free to change it.'
                : 'Feel free to choose how you want to be called.'}
          </Text>

          {/* Display Name Input */}
          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.fieldLabel,
                { fontSize: fonts.caption, color: colors.textMuted },
              ]}
            >
              DISPLAY NAME
            </Text>
            <View
              style={[
                styles.inputCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                style={[
                  styles.textInput,
                  { fontSize: fonts.body, color: colors.textPrimary },
                ]}
                placeholder="Enter your name"
                placeholderTextColor={colors.textMuted}
                autoCorrect={false}
              />
            </View>
            <Text
              style={[
                styles.helperText,
                { fontSize: fonts.caption, color: colors.textMuted },
              ]}
            >
              This is how Aura will address you in conversations.
            </Text>
          </View>

          {/* Date of Birth Input Trigger */}
          <View style={[styles.inputGroup, { marginTop: 24 }]}>
            <Text
              style={[
                styles.fieldLabel,
                { fontSize: fonts.caption, color: colors.textMuted },
              ]}
            >
              DATE OF BIRTH
            </Text>
            <TouchableOpacity
              style={[
                styles.inputCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => {
                setTempMonth(selectedMonth);
                setTempDay(selectedDay);
                setTempYear(selectedYear);
                setShowDatePicker(true);
              }}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.textInput,
                  { fontSize: fonts.body },
                  !hasSelectedBirthday
                    ? { color: colors.textMuted }
                    : { color: colors.textPrimary },
                ]}
              >
                {hasSelectedBirthday ? formattedDate : 'Select your birthday'}
              </Text>
            </TouchableOpacity>
            <Text
              style={[
                styles.helperText,
                { fontSize: fonts.caption, color: colors.textMuted },
              ]}
            >
              Used to celebrate milestones and personalize your emotional patterns.
            </Text>
          </View>
        </View>

        {/* Bottom Continue Button */}
        <View style={styles.bottomArea}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              {
                backgroundColor: accentColor,
                shadowColor: accentColor,
              },
            ]}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={[styles.continueText, { fontSize: fonts.body }]}>
              Continue →
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 3-Column Drum Wheel Picker Bottom Sheet Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: colors.surface, borderTopColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: colors.border },
              ]}
            >
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text
                  style={[
                    styles.cancelText,
                    { fontSize: fonts.body, color: colors.textSecondary },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  styles.modalTitle,
                  { fontSize: fonts.subheading, color: colors.textPrimary },
                ]}
              >
                Select Birthday
              </Text>
              <TouchableOpacity onPress={handleConfirmDate}>
                <Text
                  style={[
                    styles.confirmText,
                    { fontSize: fonts.body, color: accentColor },
                  ]}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerBody}>
              <View
                style={[
                  styles.highlightSelectionLens,
                  {
                    borderColor: `${accentColor}4D`,
                    backgroundColor: `${accentColor}12`,
                  },
                ]}
                pointerEvents="none"
              />

              {/* Month */}
              <ScrollView
                ref={monthScrollRef}
                style={styles.wheelColumn}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => handleScrollEnd(e, setTempMonth, 0)}
              >
                <View style={{ height: ITEM_HEIGHT * 2 }} />
                {MONTHS.map((month, idx) => (
                  <View key={month} style={styles.itemSlot}>
                    <Text
                      style={[
                        styles.itemText,
                        tempMonth === idx
                          ? [styles.activeItemText, { color: colors.textPrimary }]
                          : [styles.inactiveItemText, { color: colors.textMuted }],
                      ]}
                    >
                      {month}
                    </Text>
                  </View>
                ))}
                <View style={{ height: ITEM_HEIGHT * 2 }} />
              </ScrollView>

              {/* Day */}
              <ScrollView
                ref={dayScrollRef}
                style={[styles.wheelColumn, { flex: 0.6 }]}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => handleScrollEnd(e, setTempDay, 1)}
              >
                <View style={{ height: ITEM_HEIGHT * 2 }} />
                {DAYS.map((day) => (
                  <View key={day} style={styles.itemSlot}>
                    <Text
                      style={[
                        styles.itemText,
                        tempDay === day
                          ? [styles.activeItemText, { color: colors.textPrimary }]
                          : [styles.inactiveItemText, { color: colors.textMuted }],
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                ))}
                <View style={{ height: ITEM_HEIGHT * 2 }} />
              </ScrollView>

              {/* Year */}
              <ScrollView
                ref={yearScrollRef}
                style={styles.wheelColumn}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => {
                  const y = e.nativeEvent.contentOffset.y;
                  const idx = Math.round(y / ITEM_HEIGHT);
                  if (YEARS[idx]) setTempYear(YEARS[idx]);
                }}
              >
                <View style={{ height: ITEM_HEIGHT * 2 }} />
                {YEARS.map((yr) => (
                  <View key={yr} style={styles.itemSlot}>
                    <Text
                      style={[
                        styles.itemText,
                        tempYear === yr
                          ? [styles.activeItemText, { color: colors.textPrimary }]
                          : [styles.inactiveItemText, { color: colors.textMuted }],
                      ]}
                    >
                      {yr}
                    </Text>
                  </View>
                ))}
                <View style={{ height: ITEM_HEIGHT * 2 }} />
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 26,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  topContent: {
    paddingTop: 18,
  },
  avatarBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  title: {
    fontWeight: '900',
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  subtitle: {
    lineHeight: 21,
    marginBottom: 32,
  },
  inputGroup: {
    width: '100%',
  },
  fieldLabel: {
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  inputCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  textInput: {
    fontWeight: '600',
  },
  helperText: {
    marginTop: 8,
    lineHeight: 16,
  },
  bottomArea: {
    paddingBottom: 12,
  },
  continueButton: {
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  continueText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 36,
    borderTopWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontWeight: '700',
  },
  cancelText: {
    fontWeight: '600',
  },
  confirmText: {
    fontWeight: '700',
  },
  pickerBody: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    flexDirection: 'row',
    position: 'relative',
    marginTop: 8,
  },
  highlightSelectionLens: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 16,
    right: 16,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  wheelColumn: {
    flex: 1,
    height: '100%',
  },
  itemSlot: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 17,
  },
  activeItemText: {
    fontWeight: '700',
  },
  inactiveItemText: {
    fontWeight: '400',
  },
});