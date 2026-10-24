import React, { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { Colors } from "@/constants/colors";
import { ScreenState, JournalRecord, UserProfileData } from "@/types";
import { StorageService } from "@/services/storage";
import { BottomNavDock } from "@/components/common/BottomNavDock";
import { LanguageProvider } from "@/context/LanguageContext";
import { ScreenTransition } from "@/components/common/ScreenTransition";

// Core Navigation Screens
import { SplashView } from "@/screens/onboarding/SplashView";
import { OnboardingView } from "@/screens/onboarding/OnboardingView";
import { AuthView } from "@/screens/onboarding/AuthView";
import { NameSetupView } from "@/screens/onboarding/NameSetupView";
import { GenderSelectView } from "@/screens/onboarding/GenderSelectView";
import { HomeView } from "@/screens/HomeView";
import { ChatView } from "@/screens/ChatView";
import { JournalView } from "@/screens/JournalView";
import { InsightsView } from "@/screens/InsightsView";
import { ProfileView } from "@/screens/ProfileView";
import { MeditateView } from "@/screens/MeditateView";
import { VoiceCallView } from "@/screens/VoiceCallView";

// Profile Subviews & Feature Screens
import { AppearanceView } from "@/screens/profile/AppearanceView";
import { LanguageView } from "@/screens/profile/LanguageView";
import { NotificationsView } from "@/screens/profile/NotificationsView";
import { NotificationInboxView } from "@/screens/NotificationInboxView";
import { PrivacyView } from "@/screens/profile/PrivacyView";
import { ExportMemoriesView } from "@/screens/profile/ExportMemoriesView";
import { DeleteMemoriesView } from "@/screens/profile/DeleteMemoriesView";
import { SubscriptionView } from "@/screens/profile/SubscriptionView";
import { HelpView } from "@/screens/profile/HelpView";
import { AboutView } from "@/screens/profile/AboutView";
import { TermsView } from "@/screens/profile/TermsView";
import { VoiceModalView } from "@/screens/modals/VoiceModalView";

function MainNavigator() {
  const [phase, setPhase] = useState<ScreenState>("splash");
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>("Happy");
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfileData>({
    name: "User",
    email: "",
    gender: "",
    streak: 1,
    sessions: 0,
    memories: 0,
    isPremium: false,
  });
  const [journals, setJournals] = useState<JournalRecord[]>([]);

  const loadData = async () => {
    try {
      const storedProfile = await StorageService.getProfile();
      if (storedProfile && storedProfile.email) {
        setProfile(storedProfile);
      }
      const storedJournals = await StorageService.getJournals();
      if (storedJournals) {
        setJournals(storedJournals);
      }
    } catch {
      // Retain defaults if offline or clean install
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAuthComplete = (email: string) => {
    const updated = { ...profile, email };
    setProfile(updated);
    StorageService.saveProfile(updated);
    setPhase("name-setup");
  };

  const handleNameComplete = (name: string) => {
    const updated = { ...profile, name };
    setProfile(updated);
    StorageService.saveProfile(updated);
    setPhase("gender-select");
  };

  const handleGenderComplete = (gender: string) => {
    const updated = { ...profile, gender };
    setProfile(updated);
    StorageService.saveProfile(updated);
    setPhase("home");
  };

  const isMainTab = [
    "home",
    "chat",
    "voice",
    "journal",
    "insights",
    "profile",
  ].includes(phase);

  return (
    <SafeAreaView style={styles.canvasContainer}>
      <View style={{ flex: 1 }}>
        <ScreenTransition screenKey={phase}>
          {/* Onboarding Flow */}
          {phase === "splash" && (
            <SplashView onNext={() => setPhase("onboarding")} />
          )}
          {phase === "onboarding" && (
            <OnboardingView onComplete={() => setPhase("auth")} />
          )}
          {phase === "auth" && (
            <AuthView
              onGoogleSignIn={handleAuthComplete}
              onAppleSignIn={handleAuthComplete}
              onGuestContinue={handleAuthComplete}
            />
          )}
          {phase === "name-setup" && (
            <NameSetupView
              onBack={() => setPhase("auth")}
              onNext={handleNameComplete}
            />
          )}
          {phase === "gender-select" && (
            <GenderSelectView
              onBack={() => setPhase("name-setup")}
              onComplete={handleGenderComplete}
            />
          )}

          {/* 5 Primary Core Tabs */}
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
          {phase === "insights" && <InsightsView />}
          {phase === "profile" && (
            <ProfileView profile={profile} onNavigate={setPhase} />
          )}
          {phase === "voice" && (
            <VoiceCallView
              onBack={() => setPhase("home")}
              onNavigate={setPhase}
              detectedMood={`${selectedEmotion || "Calm"} detected`}
            />
          )}

          {/* Feature & Settings Sub-Screens */}
          {phase === "meditate" && (
            <MeditateView onBack={() => setPhase("home")} />
          )}
          {phase === "notification-inbox" && (
            <NotificationInboxView onBack={() => setPhase("home")} />
          )}
          {phase === "appearance" && (
            <AppearanceView onBack={() => setPhase("profile")} />
          )}
          {phase === "language" && (
            <LanguageView onBack={() => setPhase("profile")} />
          )}
          {phase === "notifications" && (
            <NotificationsView onBack={() => setPhase("profile")} />
          )}
          {phase === "privacy" && (
            <PrivacyView onBack={() => setPhase("profile")} />
          )}
          {phase === "export-memories" && (
            <ExportMemoriesView onBack={() => setPhase("profile")} />
          )}
          {phase === "delete-memories" && (
            <DeleteMemoriesView onBack={() => setPhase("profile")} />
          )}
          {phase === "subscription" && (
            <SubscriptionView
              onBack={() => setPhase("profile")}
              isPremium={profile.isPremium}
            />
          )}
          {phase === "help" && <HelpView onBack={() => setPhase("profile")} />}
          {phase === "about" && (
            <AboutView onBack={() => setPhase("profile")} onNavigate={setPhase} />
          )}
          {phase === "terms" && <TermsView onBack={() => setPhase("profile")} />}
        </ScreenTransition>
      </View>

      {/* Persistent Audio / Voice Overlay */}
      {showVoiceModal && (
        <VoiceModalView onClose={() => setShowVoiceModal(false)} />
      )}

      {/* Floating 5-Tab Bar */}
      {isMainTab && (
        <BottomNavDock activeScreen={phase} onNavigate={setPhase} />
      )}
    </SafeAreaView>
  );
}

export default function Index() {
  return (
    <LanguageProvider>
      <MainNavigator />
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});