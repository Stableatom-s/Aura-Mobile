import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { ChevronLeft, Moon, Sun, Sparkles, Check } from 'lucide-react-native';

const THEMES = [
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'auto', label: 'Auto', icon: Sparkles },
];

const ACCENT_COLORS = [
  { id: 'indigo', color: '#6366F1' },
  { id: 'purple', color: '#8B5CF6' },
  { id: 'pink', color: '#EC4899' },
  { id: 'blue', color: '#3B82F6' },
  { id: 'emerald', color: '#10B981' },
  { id: 'amber', color: '#F59E0B' },
];

const FONT_SIZES = ['Small', 'Medium', 'Large'];

export function AppearanceView({ onBack }: { onBack: () => void }) {
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [selectedAccent, setSelectedAccent] = useState('indigo');
  const [selectedFontSize, setSelectedFontSize] = useState('Medium');

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Appearance</Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* THEME */}
        <Text style={styles.sectionHeader}>THEME</Text>
        <View style={styles.themeRow}>
          {THEMES.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTheme === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                style={[styles.themeCard, isSelected && styles.themeCardActive]}
                onPress={() => setSelectedTheme(t.id)}
                activeOpacity={0.7}
              >
                <Icon size={20} color={isSelected ? '#818CF8' : 'rgba(255,255,255,0.4)'} />
                <Text style={[styles.themeLabel, isSelected && styles.themeLabelActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ACCENT COLOR */}
        <Text style={styles.sectionHeader}>ACCENT COLOR</Text>
        <View style={styles.accentRow}>
          {ACCENT_COLORS.map((item) => {
            const isSelected = selectedAccent === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.accentRing,
                  isSelected && { borderColor: item.color, backgroundColor: 'rgba(255,255,255,0.08)' },
                ]}
                onPress={() => setSelectedAccent(item.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.accentDot, { backgroundColor: item.color }]} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* FONT SIZE */}
        <Text style={styles.sectionHeader}>FONT SIZE</Text>
        <View style={styles.fontCard}>
          {FONT_SIZES.map((size, idx) => {
            const isSelected = selectedFontSize === size;
            const isLast = idx === FONT_SIZES.length - 1;
            return (
              <TouchableOpacity
                key={size}
                style={[
                  styles.fontRow,
                  isSelected && styles.fontRowSelected,
                  !isLast && styles.fontRowBorder,
                ]}
                onPress={() => setSelectedFontSize(size)}
                activeOpacity={0.7}
              >
                <Text style={[styles.fontLabel, isSelected && styles.fontLabelSelected]}>
                  {size}
                </Text>
                {isSelected && <Check size={16} color="#818CF8" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#0A0D18' },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 16,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: { fontSize: 20, fontWeight: '800', color: '#F8FAFC' },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionHeader: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
  },
  themeRow: { flexDirection: 'row', gap: 10 },
  themeCard: {
    flex: 1,
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  themeCardActive: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99,102,241,0.18)',
  },
  themeLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600' },
  themeLabelActive: { color: '#818CF8', fontWeight: '700' },
  accentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
  accentRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  accentDot: { width: 34, height: 34, borderRadius: 17 },
  fontCard: {
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  fontRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  fontRowSelected: {
    backgroundColor: 'rgba(99,102,241,0.16)',
  },
  fontRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  fontLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '500' },
  fontLabelSelected: { color: '#FFFFFF', fontWeight: '700' },
});