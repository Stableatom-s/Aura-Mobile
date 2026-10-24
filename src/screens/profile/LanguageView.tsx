import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { ChevronLeft, Check } from 'lucide-react-native';
import { useLanguage } from '@/context/LanguageContext';
import { LANGUAGES_LIST, SupportedLanguage } from '@/constants/translations';

export function LanguageView({ onBack }: { onBack: () => void }) {
  const { language, setLanguage, t } = useLanguage();

  const handleSelectLanguage = (code: SupportedLanguage) => {
    console.log('[LanguageView] Selecting language:', code);
    setLanguage(code);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{t('menu_language') || 'Language'}</Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.listContainer}>
          {LANGUAGES_LIST.map((item, index) => {
            const isSelected = language === item.code;
            const isLast = index === LANGUAGES_LIST.length - 1;

            return (
              <TouchableOpacity
                key={item.code}
                style={[styles.langRow, !isLast && styles.rowDivider]}
                onPress={() => handleSelectLanguage(item.code as SupportedLanguage)}
                activeOpacity={0.75}
              >
                <View>
                  <Text style={[styles.langName, isSelected && styles.langNameActive]}>
                    {item.name}
                  </Text>
                  <Text style={styles.nativeName}>{item.native}</Text>
                </View>

                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Check size={16} color="#818CF8" />
                  </View>
                )}
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
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: { fontSize: 20, fontWeight: '800', color: '#F8FAFC' },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  listContainer: {
    backgroundColor: 'rgba(23, 27, 46, 0.75)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  langName: { fontSize: 15, fontWeight: '600', color: '#F8FAFC', marginBottom: 2 },
  langNameActive: { color: '#818CF8' },
  nativeName: { fontSize: 12, color: 'rgba(255, 255, 255, 0.4)' },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(129, 140, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});