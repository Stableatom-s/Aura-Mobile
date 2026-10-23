import React, { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { Colors } from "@/constants/colors";
import { ScreenState, JournalRecord, UserProfileData } from "@/types";
import { StorageService } from "@/services/storage";
import { BottomNavDock } from "@/components/common/BottomNavDock";

// Modular Screens
import { SplashView } from "@/screens/onboarding/SplashView";
import { HomeView } from "@/screens/HomeView";
import { ChatView } from "@/screens/ChatView";
import { JournalView } from "@/screens/JournalView";
import { MeditateView } from "@/screens/MeditateView";
import { InsightsView } from "@/screens/InsightsView";
import { ProfileView } from "@/screens/ProfileView";

export default function Index() {
  const [phase, setPhase] = useState<ScreenState>("splash");
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(
    "Happy",
  );
  const [profile, setProfile] = useState<UserProfileData>({
    name: "Tanmay",
    email: "tanmay@aura.ai",
    gender: "man",
    streak: 14,
    sessions: 32,
    memories: 68,
    isPremium: false,
  });
  const [journals, setJournals] = useState<JournalRecord[]>([]);

  const loadData = () => {
    StorageService.getProfile().then(setProfile);
    StorageService.getJournals().then(setJournals);
  };

  useEffect(() => {
    loadData();
  }, []);

  const isMainTab = ["home", "chat", "journal", "insights", "profile"].includes(
    phase,
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {phase === "splash" && <SplashView onNext={() => setPhase("home")} />}
        {phase === "home" && (
          <HomeView
            userName={profile.name}
            selectedEmotion={selectedEmotion}
            onSelectEmotion={setSelectedEmotion}
            streak={profile.streak}
            onNavigate={setPhase}
          />
        )}
        {phase === "chat" && <ChatView userMood={selectedEmotion} />}
        {phase === "journal" && (
          <JournalView journals={journals} onRefreshJournals={loadData} />
        )}
        {phase === "meditate" && (
          <MeditateView onBack={() => setPhase("home")} />
        )}
        {phase === "insights" && <InsightsView />}
        {phase === "profile" && (
          <ProfileView profile={profile} onNavigate={setPhase} />
        )}
      </View>

      {/* Persistent Bottom 5-Tab Bar */}
      {isMainTab && (
        <BottomNavDock activeScreen={phase} onNavigate={setPhase} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
