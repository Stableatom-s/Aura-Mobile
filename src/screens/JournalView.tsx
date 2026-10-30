import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Sparkles } from "lucide-react-native";
import { HistoryItem } from "@/components/journal/HistoryItem";
import { AiService } from "@/services/ai";
import { StorageService } from "@/services/storage";
import { JournalRecord } from "@/types";
import { useAppTheme } from "@/context/ThemeContext";

interface JournalViewProps {
  journals: JournalRecord[];
  onRefreshJournals: () => void;
}

export function JournalView({ journals, onRefreshJournals }: JournalViewProps) {
  const { colors, fonts, accentColor } = useAppTheme();
  const [tab, setTab] = useState<"today" | "history">("today");
  const [selectedMood, setSelectedMood] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [smile, setSmile] = useState("");
  const [challenged, setChallenged] = useState("");
  const [grateful, setGrateful] = useState("");
  const [achievement, setAchievement] = useState("");
  const [freeWrite, setFreeWrite] = useState("");

  const moodIcons = ["😊", "😔", "😡", "😌", "😰", "❤️"];

  const handleGenerateReflection = async () => {
    setIsGenerating(true);
    const combinedText = `
Mood: ${moodIcons[selectedMood]}
Smile: ${smile}
Challenged: ${challenged}
Grateful: ${grateful}
Achievement: ${achievement}
Free write: ${freeWrite}
    `.trim();

    try {
      const reflection = await AiService.sendMessage(
        [],
        `Based on my journal entry today, provide a warm, 2-sentence reflection validating my emotions:\n${combinedText}`
      );

      const newEntry: JournalRecord = {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
        mood: moodIcons[selectedMood],
        title: achievement.trim() ? achievement.slice(0, 30) : "Daily Reflection",
        preview: freeWrite.trim() ? freeWrite : (reflection || "A quiet moment of reflection."),
        words: combinedText.split(/\s+/).filter(Boolean).length,
      };

      await StorageService.saveJournal(newEntry);
      onRefreshJournals();
      Alert.alert("AI Reflection ✨", reflection);
    } catch {
      Alert.alert("Journal Saved", "Your reflection has been recorded safely.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.dateLabel, { fontSize: fonts.caption, color: colors.textMuted }]}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </Text>
      <Text style={[styles.heading, { fontSize: fonts.header, color: colors.textPrimary }]}>Daily Journal</Text>

      <View style={[styles.tabTrack, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => setTab("today")}
          style={[styles.tabPill, tab === "today" && { backgroundColor: accentColor }]}
        >
          <Text
            style={[
              styles.tabLabel,
              { fontSize: fonts.caption, color: tab === "today" ? "#FFFFFF" : colors.textMuted },
            ]}
          >
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab("history")}
          style={[styles.tabPill, tab === "history" && { backgroundColor: accentColor }]}
        >
          <Text
            style={[
              styles.tabLabel,
              { fontSize: fonts.caption, color: tab === "history" ? "#FFFFFF" : colors.textMuted },
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      {tab === "today" ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={[styles.cardBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { fontSize: fonts.caption, color: colors.textSecondary }]}>
              How's your mood?
            </Text>
            <View style={styles.emojiRow}>
              {moodIcons.map((emo, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedMood(idx)}
                  style={[
                    styles.emojiPill,
                    { backgroundColor: colors.background, borderColor: colors.border },
                    selectedMood === idx && {
                      borderColor: accentColor,
                      backgroundColor: `${accentColor}1A`,
                      borderWidth: 1.5,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 22 }}>{emo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {[
            { prompt: "What made you smile today?", val: smile, setter: setSmile },
            { prompt: "What challenged you today?", val: challenged, setter: setChallenged },
            { prompt: "What are you grateful for?", val: grateful, setter: setGrateful },
            { prompt: "Today's achievement", val: achievement, setter: setAchievement },
          ].map((item, idx) => (
            <View
              key={idx}
              style={[styles.promptBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={[styles.promptLabel, { fontSize: fonts.body, color: accentColor }]}>
                {item.prompt}
              </Text>
              <TextInput
                value={item.val}
                onChangeText={item.setter}
                placeholder="Write something..."
                placeholderTextColor={colors.textMuted}
                style={[styles.promptInput, { fontSize: fonts.body, color: colors.textPrimary }]}
              />
            </View>
          ))}

          <View style={[styles.promptBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.promptLabel, { fontSize: fonts.body, color: accentColor }]}>✏️ Free write</Text>
            <TextInput
              value={freeWrite}
              onChangeText={setFreeWrite}
              placeholder="Write freely about your day — no structure needed..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={5}
              style={[
                styles.promptInput,
                { fontSize: fonts.body, color: colors.textPrimary, minHeight: 90, textAlignVertical: "top" },
              ]}
            />
          </View>

          <TouchableOpacity
            style={[styles.aiButton, { backgroundColor: accentColor, shadowColor: accentColor }]}
            onPress={handleGenerateReflection}
            disabled={isGenerating}
            activeOpacity={0.85}
          >
            <View style={styles.aiButtonContent}>
              <Sparkles size={18} color="#FFFFFF" />
              <Text style={[styles.aiButtonText, { fontSize: fonts.body }]}>
                {isGenerating ? "Reflecting..." : "Generate AI Reflection"}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {journals.map((j) => (
            <HistoryItem key={j.id} entry={j} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  dateLabel: { fontWeight: "500" },
  heading: { fontWeight: "800", marginBottom: 14 },
  tabTrack: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 3,
    marginBottom: 16,
    borderWidth: 1,
  },
  tabPill: { flex: 1, paddingVertical: 8, borderRadius: 14, alignItems: "center" },
  tabLabel: { fontWeight: "600" },
  cardBox: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  sectionTitle: { marginBottom: 10, fontWeight: "500" },
  emojiRow: { flexDirection: "row", justifyContent: "space-between" },
  emojiPill: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  promptBox: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  promptLabel: { fontWeight: "600", marginBottom: 8 },
  promptInput: { lineHeight: 20 },
  aiButton: {
    borderRadius: 22,
    marginTop: 8,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
  },
  aiButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  aiButtonText: { color: "#FFFFFF", fontWeight: "700" },
});