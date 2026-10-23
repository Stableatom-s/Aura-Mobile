import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Bell, Flame, TrendingUp } from "lucide-react-native";
import { GlowingOrb } from "@/components/common/GlowingOrb";
import { EmotionGrid } from "@/components/home/EmotionGrid";
import { QuickActions } from "@/components/home/QuickActions";
import { WeeklyChartCard } from "@/components/home/WeeklyChartCard";
import { ScreenState } from "@/types";

interface HomeViewProps {
  userName: string;
  selectedEmotion: string | null;
  onSelectEmotion: (emo: string) => void;
  streak: number;
  onNavigate: (s: ScreenState) => void;
}

export function HomeView({
  userName,
  selectedEmotion,
  onSelectEmotion,
  streak,
  onNavigate,
}: HomeViewProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.subGreeting}>Good morning</Text>
          <Text style={styles.mainGreeting}>{userName || "Tanmay"} 👋</Text>
        </View>
        <TouchableOpacity style={styles.iconCircle} onPress={() => onNavigate("notifications")}>
          <Bell size={20} color="#F8FAFC" />
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: "center", marginVertical: 16 }}>
        <GlowingOrb size={96} />
        <Text style={[styles.bodyText, { marginTop: 12 }]}>How are you feeling today?</Text>
      </View>

      <EmotionGrid selectedEmotion={selectedEmotion} onSelectEmotion={onSelectEmotion} />

      <Text style={styles.sectionHeader}>QUICK ACTIONS</Text>
      <QuickActions onNavigate={onNavigate} />

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Flame size={16} color="#FBBF24" />
            <Text style={styles.statTitle}>Streak</Text>
          </View>
          <Text style={styles.statNumber}>{streak}</Text>
          <Text style={styles.statSub}>days in a row</Text>
        </View>

        <View style={styles.statCard}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <TrendingUp size={16} color="#34D399" />
            <Text style={styles.statTitle}>Avg Mood</Text>
          </View>
          <Text style={styles.statNumber}>7.8</Text>
          <Text style={[styles.statSub, { color: "#34D399" }]}>↑ Better this week</Text>
        </View>
      </View>

      <WeeklyChartCard onViewAll={() => onNavigate("insights")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  subGreeting: { color: "rgba(255,255,255,0.5)", fontSize: 13 },
  mainGreeting: { fontSize: 24, fontWeight: "700", color: "#F8FAFC" },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  bodyText: { color: "rgba(255,255,255,0.6)", fontSize: 14 },
  sectionHeader: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: 14,
    marginBottom: 8,
  },
  statsRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  statTitle: { color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "600" },
  statNumber: { fontSize: 32, fontWeight: "900", color: "#F8FAFC", marginTop: 4 },
  statSub: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 },
});