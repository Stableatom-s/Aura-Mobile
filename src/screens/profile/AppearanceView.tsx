import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme, ACCENT_PRESETS, ThemeMode, FontSizeKey } from '../../context/ThemeContext';

export function AppearanceView({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  const {
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    fontSize,
    setFontSize,
    fonts,
    colors,
  } = useAppTheme();

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  const accentTintBackground = `${accentColor}1A`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: fonts.header, color: colors.textPrimary }]}>
          Appearance
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* THEME */}
        <Text style={[styles.sectionTitle, { fontSize: fonts.caption, color: colors.textMuted }]}>
          THEME
        </Text>
        <View style={styles.themeGrid}>
          {(['dark', 'light', 'auto'] as ThemeMode[]).map((mode) => {
            const isActive = theme === mode;
            return (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.themeCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  isActive && { borderColor: accentColor, backgroundColor: accentTintBackground },
                ]}
                onPress={() => setTheme(mode)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={mode === 'dark' ? 'moon-outline' : mode === 'light' ? 'sunny-outline' : 'sparkles-outline'}
                  size={22}
                  color={isActive ? accentColor : colors.textMuted}
                />
                <Text
                  style={[
                    styles.themeCardLabel,
                    { fontSize: fonts.caption, color: isActive ? colors.textPrimary : colors.textSecondary },
                    isActive && { fontWeight: '700' },
                  ]}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ACCENT COLOR */}
        <Text style={[styles.sectionTitle, { fontSize: fonts.caption, color: colors.textMuted }]}>
          ACCENT COLOR
        </Text>
        <View style={styles.accentColorsRow}>
          {ACCENT_PRESETS.map((item) => {
            const isSelected = accentColor === item.color;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setAccentColor(item.color)}
                style={styles.swatchTouch}
                activeOpacity={0.7}
              >
                <View style={[styles.swatchRing, isSelected && { borderColor: item.color }]}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: item.color },
                      isSelected && styles.colorDotSelected,
                    ]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* FONT SIZE */}
        <Text style={[styles.sectionTitle, { fontSize: fonts.caption, color: colors.textMuted }]}>
          FONT SIZE
        </Text>
        <View style={[styles.fontSizeContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {(['small', 'medium', 'large'] as FontSizeKey[]).map((sizeKey, idx) => {
            const isSelected = fontSize === sizeKey;
            return (
              <React.Fragment key={sizeKey}>
                {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                <TouchableOpacity
                  style={[styles.fontSizeRow, isSelected && { backgroundColor: accentTintBackground }]}
                  onPress={() => setFontSize(sizeKey)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.fontSizeText,
                      { fontSize: fonts.body, color: isSelected ? colors.textPrimary : colors.textSecondary },
                      isSelected && { fontWeight: '700' },
                    ]}
                  >
                    {sizeKey.charAt(0).toUpperCase() + sizeKey.slice(1)}
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={20} color={accentColor} />}
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 56 : 24,
    paddingBottom: 20,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 14,
    marginTop: 18,
  },
  themeGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  themeCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  themeCardLabel: {
    fontWeight: '500',
  },
  accentColorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginBottom: 20,
  },
  swatchTouch: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorDotSelected: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  fontSizeContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  fontSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  fontSizeText: {
    fontWeight: '500',
  },
  divider: {
    height: 1,
  },
});