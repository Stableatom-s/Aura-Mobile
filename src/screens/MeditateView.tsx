import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Play, Pause } from "lucide-react-native";
import { BackHeader } from "@/components/common/BackHeader";

interface MeditateViewProps {
  onBack: () => void;
}

const MEDITATE_SESSIONS = [
  { emoji: "🌿", title: "Forest Calm", duration: "5 min", category: "Anxiety", color: "#34D399" },
  { emoji: "🌊", title: "Ocean Breath", duration: "10 min", category: "Stress", color: "#60A5FA" },
  { emoji: "🌙", title: "Sleep Prep", duration: "15 min", category: "Sleep", color: "#818CF8" },
  { emoji: "☀️", title: "Morning Energy", duration: "7 min", category: "Focus", color: "#FBBF24" },
  { emoji: "💜", title: "Self-Compassion", duration: "12 min", category: "Anxiety", color: "#C4B5FD" },
];

export function MeditateView({ onBack }: MeditateViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={styles.container}>
      <BackHeader title="Meditate" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={styles.circleContainer}>
          <View style={styles.breathOuter}>
            <View style={styles.breathInner}>
              <Text style={styles.statusText}>{isPlaying ? "Inhale..." : "Ready"}</Text>
            </View>
          </View>
          <Text style={styles.subPrompt}>Start your breathing exercise</Text>

          <TouchableOpacity style={styles.playBtn} onPress={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause size={24} color="#fff" /> : <Play size={24} color="#fff" fill="#fff" />}
          </TouchableOpacity>

          <View style={styles.phaseRow}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.phaseNumber}>4s</Text>
              <Text style={styles.phaseLabel}>In</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.phaseNumber}>4s</Text>
              <Text style={styles.phaseLabel}>Hold</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.phaseNumber}>6s</Text>
              <Text style={styles.phaseLabel}>Out</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionHeader}>GUIDED SESSIONS</Text>
        {MEDITATE_SESSIONS.map((sess) => (
          <TouchableOpacity key={sess.title} style={styles.cardItem}>
            <View style={styles.emojiSquare}>
              <Text style={{ fontSize: 20 }}>{sess.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{sess.title}</Text>
              <Text style={styles.cardSub}>
                {sess.duration} · <Text style={{ color: sess.color }}>{sess.category}</Text>
              </Text>
            </View>
            <Play size={18} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  circleContainer: { alignItems: "center", marginVertical: 24 },
  breathOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(99,102,241,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  breathInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#818CF8",
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  subPrompt: { color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 18, marginBottom: 20 },
  playBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  phaseRow: { flexDirection: "row", gap: 36, marginTop: 18 },
  phaseNumber: { fontSize: 18, fontWeight: "800", color: "#818CF8" },
  phaseLabel: { fontSize: 11, color: "rgba(255,255,255,0.35)" },
  sectionHeader: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: 14,
    marginBottom: 8,
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  emojiSquare: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardTitle: { color: "#F8FAFC", fontWeight: "600", fontSize: 15 },
  cardSub: { color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 },
});