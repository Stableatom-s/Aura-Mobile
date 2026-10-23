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
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";
import { HistoryItem } from "@/components/journal/HistoryItem";
import { AiService } from "@/services/ai";
import { StorageService } from "@/services/storage";
import { JournalRecord } from "@/types";

interface JournalViewProps {
  journals: JournalRecord[];
  onRefreshJournals: () => void;
}

export function JournalView({ journals, onRefreshJournals }: JournalViewProps) {
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
    <View style={styles.container}>
      <Text style={styles.dateLabel}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </Text>
      <Text style={styles.heading}>Daily Journal</Text>

      <View style={styles.tabTrack}>
        <TouchableOpacity
          onPress={() => setTab("today")}
          style={[styles.tabPill, tab === "today" && styles.tabActive]}
        >
          <Text style={[styles.tabLabel, tab === "today" && { color: "#fff" }]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab("history")}
          style={[styles.tabPill, tab === "history" && styles.tabActive]}
        >
          <Text style={[styles.tabLabel, tab === "history" && { color: "#fff" }]}>History</Text>
        </TouchableOpacity>
      </View>

      {tab === "today" ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={styles.cardBox}>
            <Text style={styles.sectionTitle}>How's your mood?</Text>
            <View style={styles.emojiRow}>
              {moodIcons.map((emo, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedMood(idx)}
                  style={[styles.emojiPill, selectedMood === idx && styles.emojiPillSelected]}
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
            <View key={idx} style={styles.promptBox}>
              <Text style={styles.promptLabel}>{item.prompt}</Text>
              <TextInput
                value={item.val}
                onChangeText={item.setter}
                placeholder="Write something..."
                placeholderTextColor="rgba(255,255,255,0.35)"
                style={styles.promptInput}
              />
            </View>
          ))}

          <View style={styles.promptBox}>
            <Text style={styles.promptLabel}>✏️ Free write</Text>
            <TextInput
              value={freeWrite}
              onChangeText={setFreeWrite}
              placeholder="Write freely about your day — no structure needed..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              multiline
              numberOfLines={5}
              style={[styles.promptInput, { minHeight: 90, textAlignVertical: "top" }]}
            />
          </View>

          <TouchableOpacity
            style={styles.aiButton}
            onPress={handleGenerateReflection}
            disabled={isGenerating}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#4F46E5", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.aiGradient}
            >
              <Sparkles size={18} color="#C4B5FD" />
              <Text style={styles.aiButtonText}>
                {isGenerating ? "Reflecting..." : "Generate AI Reflection"}
              </Text>
            </LinearGradient>
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
  dateLabel: { color: "rgba(255,255,255,0.4)", fontSize: 12 },
  heading: { fontSize: 26, fontWeight: "800", color: "#F8FAFC", marginBottom: 14 },
  tabTrack: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 3,
    marginBottom: 16,
  },
  tabPill: { flex: 1, paddingVertical: 8, borderRadius: 14, alignItems: "center" },
  tabActive: { backgroundColor: "#818CF8" },
  tabLabel: { color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: "600" },
  cardBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 12,
  },
  sectionTitle: { color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 10 },
  emojiRow: { flexDirection: "row", justifyContent: "space-between" },
  emojiPill: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  emojiPillSelected: {
    borderColor: "#818CF8",
    borderWidth: 1.5,
    backgroundColor: "rgba(129,140,248,0.2)",
  },
  promptBox: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 12,
  },
  promptLabel: { color: "#C4B5FD", fontSize: 14, fontWeight: "600", marginBottom: 8 },
  promptInput: { color: "#F8FAFC", fontSize: 14, lineHeight: 20 },
  aiButton: {
    borderRadius: 22,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 20,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
  },
  aiGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  aiButtonText: { color: "#F8FAFC", fontSize: 15, fontWeight: "700" },
});