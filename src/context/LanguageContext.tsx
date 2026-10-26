import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSLATIONS, SupportedLanguage, LANGUAGES_LIST } from '@/constants/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = '@aura_selected_language';
const VALID_CODES: string[] = LANGUAGES_LIST.map((l) => l.code);

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  // Load persisted language on start
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved && VALID_CODES.includes(saved)) {
          setLanguageState(saved as SupportedLanguage);
        }
      } catch (e) {
        console.warn('AsyncStorage load language error:', e);
      }
    })();
  }, []);

  const setLanguage = (newLang: SupportedLanguage) => {
    // 1. Instant state update triggers immediate re-render across the entire tree
    setLanguageState(newLang);
    // 2. Persist in background
    AsyncStorage.setItem(STORAGE_KEY, newLang).catch((err) =>
      console.warn('AsyncStorage save error:', err)
    );
  };

  const t = (key: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English if translation is missing in selected language
    return TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);