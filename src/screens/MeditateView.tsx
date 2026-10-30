import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Play, Pause } from "lucide-react-native";
import { BackHeader } from "@/components/common/BackHeader";
import { useAppTheme } from "@/context/ThemeContext";

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
  const { colors, fonts, accentColor } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BackHeader title="Meditate" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={styles.circleContainer}>
          <View style={[styles.breathOuter, { backgroundColor: `${accentColor}1A` }]}>
            <View style={[styles.breathInner, { backgroundColor: accentColor }]}>
              <Text style={[styles.statusText, { fontSize: fonts.body }]}>{isPlaying ? "Inhale..." : "Ready"}</Text>
            </View>
          </View>
          <Text style={[styles.subPrompt, { fontSize: fonts.caption, color: colors.textSecondary }]}>
            Start your breathing exercise
          </Text>

          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: accentColor }]}
            onPress={() => setIsPlaying(!isPlaying)}
            activeOpacity={0.8}
          >
            {isPlaying ? <Pause size={24} color="#fff" /> : <Play size={24} color="#fff" fill="#fff" />}
          </TouchableOpacity>

          <View style={styles.phaseRow}>
            <View style={{ alignItems: "center" }}>
              <Text style={[styles.phaseNumber, { fontSize: fonts.title, color: accentColor }]}>4s</Text>
              <Text style={[styles.phaseLabel, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>In</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={[styles.phaseNumber, { fontSize: fonts.title, color: accentColor }]}>4s</Text>
              <Text style={[styles.phaseLabel, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>Hold</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={[styles.phaseNumber, { fontSize: fonts.title, color: accentColor }]}>6s</Text>
              <Text style={[styles.phaseLabel, { fontSize: fonts.caption - 1, color: colors.textMuted }]}>Out</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionHeader, { fontSize: fonts.caption, color: colors.textMuted }]}>
          GUIDED SESSIONS
        </Text>
        {MEDITATE_SESSIONS.map((sess) => (
          <TouchableOpacity
            key={sess.title}
            style={[styles.cardItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.75}
          >
            <View style={[styles.emojiSquare, { backgroundColor: colors.background }]}>
              <Text style={{ fontSize: 20 }}>{sess.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { fontSize: fonts.body, color: colors.textPrimary }]}>{sess.title}</Text>
              <Text style={[styles.cardSub, { fontSize: fonts.caption, color: colors.textMuted }]}>
                {sess.duration} · <Text style={{ color: sess.color }}>{sess.category}</Text>
              </Text>
            </View>
            <Play size={18} color={colors.textMuted} />
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
    justifyContent: "center",
    alignItems: "center",
  },
  breathInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: { color: "#fff", fontWeight: "700" },
  subPrompt: { marginTop: 18, marginBottom: 20 },
  playBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
  },
  phaseRow: { flexDirection: "row", gap: 36, marginTop: 18 },
  phaseNumber: { fontWeight: "800" },
  phaseLabel: {},
  sectionHeader: {
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 8,
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  emojiSquare: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardTitle: { fontWeight: "600" },
  cardSub: { marginTop: 2 },
});