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
  const [displayName, setDisplayName] = useState(initialName);
  const [selectedMonth, setSelectedMonth] = useState(8); // September (0-indexed)
  const [selectedDay, setSelectedDay] = useState(4);
  const [selectedYear, setSelectedYear] = useState(2000);
  const [hasSelectedBirthday, setHasSelectedBirthday] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [tempMonth, setTempMonth] = useState(selectedMonth);
  const [tempDay, setTempDay] = useState(selectedDay);
  const [tempYear, setTempYear] = useState(selectedYear);

  const monthScrollRef = useRef<ScrollView>(null);
  const dayScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);

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
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.topContent}>
          {/* Top Dynamic Auth Provider Badge */}
          <View style={styles.avatarBadge}>
            {authProvider === 'apple' ? (
              <Ionicons name="logo-apple" size={22} color="#FFFFFF" />
            ) : authProvider === 'google' ? (
              <Text style={styles.avatarText}>G</Text>
            ) : (
              <Ionicons name="person-outline" size={20} color="#FFFFFF" />
            )}
          </View>

          {/* Heading and Description */}
          <Text style={styles.title}>What should we call you?</Text>
          <Text style={styles.subtitle}>
            {authProvider === 'apple'
              ? 'Your name from Apple is pre-filled. Feel free to change it.'
              : authProvider === 'google'
              ? 'Your name from Google is pre-filled. Feel free to change it.'
              : 'Feel free to choose how you want to be called.'}
          </Text>

          {/* Display Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>DISPLAY NAME</Text>
            <View style={styles.inputCard}>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                style={styles.textInput}
                placeholder="Enter your name"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                autoCorrect={false}
              />
            </View>
            <Text style={styles.helperText}>
              This is how Aura will address you in conversations.
            </Text>
          </View>

          {/* Date of Birth Input Trigger */}
          <View style={[styles.inputGroup, { marginTop: 24 }]}>
            <Text style={styles.fieldLabel}>DATE OF BIRTH</Text>
            <TouchableOpacity
              style={styles.inputCard}
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
                  !hasSelectedBirthday && styles.placeholderColor,
                ]}
              >
                {hasSelectedBirthday ? formattedDate : 'Select your birthday'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.helperText}>
              Used to celebrate milestones and personalize your emotional patterns.
            </Text>
          </View>
        </View>

        {/* Bottom Continue Button */}
        <View style={styles.bottomArea}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueText}>Continue →</Text>
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
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Birthday</Text>
              <TouchableOpacity onPress={handleConfirmDate}>
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerBody}>
              <View style={styles.highlightSelectionLens} pointerEvents="none" />

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
                        tempMonth === idx ? styles.activeItemText : styles.inactiveItemText,
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
                        tempDay === day ? styles.activeItemText : styles.inactiveItemText,
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
                        tempYear === yr ? styles.activeItemText : styles.inactiveItemText,
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
    backgroundColor: '#0A0D1D',
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
    backgroundColor: 'rgba(23, 28, 54, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  title: {
    fontSize: 27,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14.5,
    color: 'rgba(255, 255, 255, 0.55)',
    lineHeight: 21,
    marginBottom: 32,
  },
  inputGroup: {
    width: '100%',
  },
  fieldLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  inputCard: {
    backgroundColor: 'rgba(23, 27, 48, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 15.5,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  placeholderColor: {
    color: 'rgba(255, 255, 255, 0.35)',
  },
  helperText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.35)',
    marginTop: 8,
    lineHeight: 16,
  },
  bottomArea: {
    paddingBottom: 12,
  },
  continueButton: {
    backgroundColor: '#6D5DF5',
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6D5DF5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#12162A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelText: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 15,
    fontWeight: '600',
  },
  confirmText: {
    color: '#818CF8',
    fontSize: 15,
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
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
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
    color: '#FFFFFF',
    fontWeight: '700',
  },
  inactiveItemText: {
    color: 'rgba(255, 255, 255, 0.28)',
    fontWeight: '400',
  },
});