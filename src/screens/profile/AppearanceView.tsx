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
import {
  useAppTheme,
  ACCENT_PRESETS,
  ThemeMode,
  FontSizeKey,
} from '../../context/ThemeContext';

interface AppearanceViewProps {
  onBack?: () => void;
}

export function AppearanceView({ onBack }: AppearanceViewProps) {
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
    t,
  } = useAppTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const accentTintBackground = `${accentColor}1A`;
  const accentBorder = accentColor;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: fonts.header, color: colors.textPrimary }]}>
          {t('Appearance')}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* THEME SECTION */}
        <Text style={[styles.sectionTitle, { fontSize: fonts.caption, color: colors.textMuted }]}>
          {t('theme')}
        </Text>
        <View style={styles.themeGrid}>
          {/* Dark Card */}
          <TouchableOpacity
            style={[
              styles.themeCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              theme === 'dark' && {
                borderColor: accentBorder,
                backgroundColor: accentTintBackground,
              },
            ]}
            onPress={() => setTheme('dark')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="moon-outline"
              size={22}
              color={theme === 'dark' ? accentColor : colors.textMuted}
            />
            <Text
              style={[
                styles.themeCardLabel,
                { fontSize: fonts.caption, color: colors.textSecondary },
                theme === 'dark' && { color: colors.textPrimary, fontWeight: '700' },
              ]}
            >
              {t('themeDark')}
            </Text>
          </TouchableOpacity>

          {/* Light Card */}
          <TouchableOpacity
            style={[
              styles.themeCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              theme === 'light' && {
                borderColor: accentBorder,
                backgroundColor: accentTintBackground,
              },
            ]}
            onPress={() => setTheme('light')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="sunny-outline"
              size={22}
              color={theme === 'light' ? accentColor : colors.textMuted}
            />
            <Text
              style={[
                styles.themeCardLabel,
                { fontSize: fonts.caption, color: colors.textSecondary },
                theme === 'light' && { color: colors.textPrimary, fontWeight: '700' },
              ]}
            >
              {t('themeLight')}
            </Text>
          </TouchableOpacity>

          {/* Auto Card */}
          <TouchableOpacity
            style={[
              styles.themeCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              theme === 'auto' && {
                borderColor: accentBorder,
                backgroundColor: accentTintBackground,
              },
            ]}
            onPress={() => setTheme('auto')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="sparkles-outline"
              size={22}
              color={theme === 'auto' ? accentColor : colors.textMuted}
            />
            <Text
              style={[
                styles.themeCardLabel,
                { fontSize: fonts.caption, color: colors.textSecondary },
                theme === 'auto' && { color: colors.textPrimary, fontWeight: '700' },
              ]}
            >
              {t('themeAuto')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ACCENT COLOR SECTION */}
        <Text style={[styles.sectionTitle, { fontSize: fonts.caption, color: colors.textMuted }]}>
          {t('accentColor')}
        </Text>
        <View style={styles.accentColorsRow}>
          {ACCENT_PRESETS.map((item) => {
            const isSelected = accentColor.toLowerCase() === item.color.toLowerCase();
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setAccentColor(item.color)}
                style={styles.swatchTouch}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.swatchRing,
                    isSelected && { borderColor: item.color },
                  ]}
                >
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

        {/* FONT SIZE SECTION */}
        <Text style={[styles.sectionTitle, { fontSize: fonts.caption, color: colors.textMuted }]}>
          {t('fontSize')}
        </Text>
        <View style={[styles.fontSizeContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {(['small', 'medium', 'large'] as FontSizeKey[]).map((sizeKey, idx) => {
            const isSelected = fontSize === sizeKey;
            const labelKey = sizeKey === 'small' ? 'Small' : sizeKey === 'medium' ? 'Medium' : 'Large';

            return (
              <React.Fragment key={sizeKey}>
                {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                <TouchableOpacity
                  style={[
                    styles.fontSizeRow,
                    isSelected && { backgroundColor: accentTintBackground },
                  ]}
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
                    {t(labelKey)}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={20} color={accentColor} />
                  )}
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
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 56 : 24,
    paddingBottom: 24,
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