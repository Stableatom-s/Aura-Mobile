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
import { useAppTheme } from '@/context/ThemeContext';

export function LanguageView({ onBack }: { onBack: () => void }) {
  const { language, setLanguage, t } = useLanguage();
  const { colors, fonts, accentColor } = useAppTheme();

  const handleSelectLanguage = (code: SupportedLanguage) => {
    console.log('[LanguageView] Selecting language:', code);
    setLanguage(code);
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { fontSize: fonts.title, color: colors.textPrimary }]}>
          {t('menu_language') || 'Language'}
        </Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {LANGUAGES_LIST.map((item, index) => {
            const isSelected = language === item.code;
            const isLast = index === LANGUAGES_LIST.length - 1;

            return (
              <TouchableOpacity
                key={item.code}
                style={[
                  styles.langRow,
                  !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  isSelected && { backgroundColor: `${accentColor}1A` },
                ]}
                onPress={() => handleSelectLanguage(item.code as SupportedLanguage)}
                activeOpacity={0.75}
              >
                <View>
                  <Text
                    style={[
                      styles.langName,
                      {
                        fontSize: fonts.body,
                        color: isSelected ? accentColor : colors.textPrimary,
                        fontWeight: isSelected ? '700' : '600',
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text style={[styles.nativeName, { fontSize: fonts.caption, color: colors.textMuted }]}>
                    {item.native}
                  </Text>
                </View>

                {isSelected && (
                  <View style={[styles.checkBadge, { backgroundColor: `${accentColor}25` }]}>
                    <Check size={16} color={accentColor} />
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
  safeContainer: { flex: 1 },
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
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: { fontWeight: '800' },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  listContainer: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  langName: { marginBottom: 2 },
  nativeName: {},
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});