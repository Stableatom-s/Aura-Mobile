import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';

const MOODS = ['Calm', 'Happy', 'Grateful', 'Tired', 'Anxious', 'Reflective'];

interface JournalViewProps {
  journals?: any[];
  onRefreshJournals?: () => void;
}

export function JournalView({ onRefreshJournals }: JournalViewProps) {
  const { colors, fonts, accentColor } = useAppTheme();
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [reflectionText, setReflectionText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCloudJournals = async () => {
    try {
      setLoading(true);
      const data = await apiService.getJournalEntries();
      if (data?.entries) {
        setEntries(data.entries);
      }
    } catch (err) {
      console.warn('Could not load cloud journals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCloudJournals();
  }, []);

  const handleSaveEntry = async () => {
    const trimmed = reflectionText.trim();
    if (!trimmed || saving) return;

    try {
      setSaving(true);
      const res = await apiService.createJournalEntry({
        emotion: selectedMood,
        reflectionText: trimmed,
      });

      if (res?.entry) {
        setEntries((prev) => [res.entry, ...prev]);
        setReflectionText('');
        onRefreshJournals?.();
      }
    } catch (err) {
      console.warn('Error saving journal entry:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteJournalEntry(id);
      setEntries((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.warn('Error deleting entry:', err);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.textPrimary, fontSize: fonts.header }]}>
          Daily Journal
        </Text>

        {/* Mood Selector */}
        <View style={styles.moodRow}>
          {MOODS.map((mood) => {
            const active = selectedMood === mood;
            return (
              <TouchableOpacity
                key={mood}
                onPress={() => setSelectedMood(mood)}
                style={[
                  styles.moodChip,
                  {
                    backgroundColor: active ? accentColor : colors.surface,
                    borderColor: active ? accentColor : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.moodChipText,
                    { color: active ? '#FFFFFF' : colors.textSecondary, fontSize: fonts.caption },
                  ]}
                >
                  {mood}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* New Reflection Composer */}
        <View style={[styles.composerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TextInput
            value={reflectionText}
            onChangeText={setReflectionText}
            placeholder="Write a quick reflection..."
            placeholderTextColor={colors.textMuted}
            multiline
            style={[styles.composerInput, { color: colors.textPrimary, fontSize: fonts.body }]}
          />
          <TouchableOpacity
            onPress={handleSaveEntry}
            disabled={saving || !reflectionText.trim()}
            style={[styles.saveBtn, { backgroundColor: accentColor }]}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveBtnText}>Save to Cloud</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Entries List */}
        {loading ? (
          <ActivityIndicator size="large" color={accentColor} style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 110, gap: 12 }}
            renderItem={({ item }) => (
              <View style={[styles.entryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.entryHeader}>
                  <Text style={[styles.entryEmotion, { color: accentColor, fontSize: fonts.caption }]}>
                    {item.emotion.toUpperCase()}
                  </Text>
                  <TouchableOpacity onPress={() => handleDelete(item._id)}>
                    <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.entryBody, { color: colors.textPrimary, fontSize: fonts.body }]}>
                  {item.reflectionText}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  title: { fontWeight: '900', marginBottom: 14 },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  moodChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1 },
  moodChipText: { fontWeight: '600' },
  composerCard: { borderRadius: 18, borderWidth: 1, padding: 14, marginBottom: 18 },
  composerInput: { minHeight: 70, textAlignVertical: 'top', marginBottom: 10 },
  saveBtn: { alignSelf: 'flex-end', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  entryCard: { borderRadius: 16, borderWidth: 1, padding: 16 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  entryEmotion: { fontWeight: '800', letterSpacing: 0.8 },
  entryBody: { lineHeight: 20 },
});