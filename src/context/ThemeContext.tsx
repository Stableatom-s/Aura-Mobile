import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'dark' | 'light' | 'auto';
export type FontSizeKey = 'small' | 'medium' | 'large';

export interface FontScaleConfig {
  scale: number;
  caption: number;
  body: number;
  subheading: number;
  title: number;
  header: number;
}

const FONT_PRESETS: Record<FontSizeKey, FontScaleConfig> = {
  small: { scale: 0.88, caption: 11, body: 13, subheading: 14, title: 18, header: 22 },
  medium: { scale: 1.0, caption: 12, body: 15, subheading: 16, title: 20, header: 26 },
  large: { scale: 1.15, caption: 14, body: 17, subheading: 18, title: 23, header: 30 },
};

export const ACCENT_PRESETS = [
  { id: 'indigo', color: '#6366F1' },
  { id: 'purple', color: '#9333EA' },
  { id: 'pink', color: '#EC4899' },
  { id: 'blue', color: '#3B82F6' },
  { id: 'teal', color: '#10B981' },
  { id: 'orange', color: '#F59E0B' },
];

const STORAGE_KEYS = {
  THEME: '@aura_theme_mode',
  ACCENT: '@aura_accent_color',
  FONT_SIZE: '@aura_font_size',
};

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  fontSize: FontSizeKey;
  setFontSize: (size: FontSizeKey) => void;
  fonts: FontScaleConfig;
  colors: {
    background: string;
    surface: string;
    surfaceSecondary: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    accentTint: string;
  };
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColorState] = useState<string>('#6366F1');
  const [fontSize, setFontSizeState] = useState<FontSizeKey>('medium');

  // Load saved preferences on startup
  useEffect(() => {
    (async () => {
      try {
        const [savedTheme, savedAccent, savedFont] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.THEME),
          AsyncStorage.getItem(STORAGE_KEYS.ACCENT),
          AsyncStorage.getItem(STORAGE_KEYS.FONT_SIZE),
        ]);

        if (savedTheme) setThemeState(savedTheme as ThemeMode);
        if (savedAccent) setAccentColorState(savedAccent);
        if (savedFont) setFontSizeState(savedFont as FontSizeKey);
      } catch (err) {
        console.warn('Failed to load theme preferences from storage:', err);
      }
    })();
  }, []);

  // Update & persist
  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    AsyncStorage.setItem(STORAGE_KEYS.THEME, mode).catch(() => {});
  };

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
    AsyncStorage.setItem(STORAGE_KEYS.ACCENT, color).catch(() => {});
  };

  const setFontSize = (size: FontSizeKey) => {
    setFontSizeState(size);
    AsyncStorage.setItem(STORAGE_KEYS.FONT_SIZE, size).catch(() => {});
  };

  const colors = useMemo(() => {
    const isDark = theme === 'dark' || theme === 'auto';
    return {
      background: isDark ? '#070914' : '#F8FAFC',
      surface: isDark ? '#0E1325' : '#FFFFFF',
      surfaceSecondary: isDark ? '#161C36' : '#F1F5F9',
      border: isDark ? '#181F3B' : '#E2E8F0',
      textPrimary: isDark ? '#FFFFFF' : '#0F172A',
      textSecondary: isDark ? '#8A8FAD' : '#475569',
      textMuted: isDark ? '#5C6587' : '#94A3B8',
      accent: accentColor,
      accentTint: `${accentColor}1A`,
    };
  }, [theme, accentColor]);

  const t = (key: string): string => {
  return key;
};

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      accentColor,
      setAccentColor,
      fontSize,
      setFontSize,
      fonts: FONT_PRESETS[fontSize],
      colors,
      t,
    }),
    [theme, accentColor, fontSize, colors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}