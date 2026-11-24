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

function formatEntryDate(isoDate?: string): string {
  if (!isoDate) return 'Just now';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return 'Just now';
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function JournalView({ onRefreshJournals }: JournalViewProps) {
  const { colors, fonts, accentColor } = useAppTheme();
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [reflectionText, setReflectionText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCloudJournals = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await apiService.getJournalEntries();
      if (data?.entries) {
        setEntries(data.entries);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to sync journal entries right now.');
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
      setErrorMsg(null);
      const res = await apiService.createJournalEntry({
        emotion: selectedMood,
        reflectionText: trimmed,
      });

      if (res?.entry) {
        setEntries((prev) => [res.entry, ...prev]);
        setReflectionText('');
        onRefreshJournals?.();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save journal entry.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setErrorMsg(null);
      await apiService.deleteJournalEntry(id);
      setEntries((prev) => prev.filter((item) => (item._id || item.id) !== id));
      onRefreshJournals?.();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to delete entry.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.textPrimary, fontSize: fonts.header }]}>
          Daily Journal
        </Text>

        {errorMsg && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
            <Text style={[styles.errorText, { fontSize: fonts.caption }]}>{errorMsg}</Text>
          </View>
        )}

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
            style={[
              styles.saveBtn,
              {
                backgroundColor: accentColor,
                opacity: saving || !reflectionText.trim() ? 0.5 : 1,
              },
            ]}
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
            keyExtractor={(item) => String(item._id || item.id)}
            contentContainerStyle={{ paddingBottom: 110, gap: 12 }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: colors.textMuted, fontSize: fonts.body }]}>
                  No journal reflections yet. Write your first reflection above.
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const itemId = String(item._id || item.id);
              return (
                <View style={[styles.entryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.entryHeader}>
                    <View style={styles.metaRow}>
                      <Text style={[styles.entryEmotion, { color: accentColor, fontSize: fonts.caption }]}>
                        {String(item.emotion || 'REFLECTIVE').toUpperCase()}
                      </Text>
                      <Text style={[styles.entryDate, { color: colors.textMuted, fontSize: fonts.caption - 1 }]}>
                        {formatEntryDate(item.createdAt)}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDelete(itemId)} hitSlop={8}>
                      <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.entryBody, { color: colors.textPrimary, fontSize: fonts.body }]}>
                    {item.reflectionText}
                  </Text>
                </View>
              );
            }}
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  errorText: { color: '#EF4444', flex: 1, fontWeight: '500' },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  moodChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1 },
  moodChipText: { fontWeight: '600' },
  composerCard: { borderRadius: 18, borderWidth: 1, padding: 14, marginBottom: 18 },
  composerInput: { minHeight: 70, textAlignVertical: 'top', marginBottom: 10 },
  saveBtn: { alignSelf: 'flex-end', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  emptyState: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 20 },
  emptyText: { textAlign: 'center', lineHeight: 20 },
  entryCard: { borderRadius: 16, borderWidth: 1, padding: 16 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  entryEmotion: { fontWeight: '800', letterSpacing: 0.8 },
  entryDate: { fontWeight: '500' },
  entryBody: { lineHeight: 20 },
});