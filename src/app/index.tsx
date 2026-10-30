import React, { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { Colors } from "@/constants/colors";
import { ScreenState, JournalRecord, UserProfileData } from "@/types";
import { StorageService } from "@/services/storage";
import { apiService } from "@/services/apiService";
import { BottomNavDock } from "@/components/common/BottomNavDock";
import { LanguageProvider } from "@/context/LanguageContext";
import { ScreenTransition } from "@/components/common/ScreenTransition";

// Core Navigation Screens
import { SplashView } from "@/screens/onboarding/SplashView";
import { OnboardingView } from "@/screens/onboarding/OnboardingView";
import { AuthView } from "@/screens/onboarding/AuthView";
import { NameSetupView, DateOfBirthPayload } from "@/screens/onboarding/NameSetupView";
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
  const [userId, setUserId] = useState<string | null>(null);
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
      const storedJournals = await StorageService.getJournals();
      if (storedJournals) {
        setJournals(storedJournals);
      }
    } catch {
      // Retain defaults if offline
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. Google/Apple Auth Done -> strictly go to name-setup
  const handleAuthSuccess = (userData: any, _isNewUser: boolean) => {
    const dbId = userData?.id || userData?._id;
    if (dbId) setUserId(dbId);

    const updated: UserProfileData = {
      ...profile,
      email: userData?.email || profile.email,
      name: userData?.fullName || profile.name,
      isPremium: userData?.subscription?.isPro ?? profile.isPremium,
    };
    setProfile(updated);
    StorageService.saveProfile(updated);

    // Explicitly transition to name-setup
    setPhase("name-setup");
  };

  // 2. Name & Birthdate Setup Done -> strictly go to gender-select
  const handleNameComplete = async (name: string, dateOfBirth?: DateOfBirthPayload) => {
    const updated = { ...profile, name };
    setProfile(updated);
    StorageService.saveProfile(updated);

    if (userId) {
      try {
        await apiService.updateProfile(userId, { fullName: name, dateOfBirth });
      } catch (err) {
        console.warn("Backend name/birthdate sync error:", err);
      }
    }

    setPhase("gender-select");
  };

  // 3. Gender Setup Done -> only now land on home
  const handleGenderComplete = async (gender: string) => {
    const updated = { ...profile, gender };
    setProfile(updated);
    StorageService.saveProfile(updated);

    if (userId) {
      try {
        await apiService.updateProfile(userId, { gender });
      } catch (err) {
        console.warn("Backend gender sync error:", err);
      }
    }

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
          {/* Onboarding Sequence */}
          {phase === "splash" && (
            <SplashView onNext={() => setPhase("onboarding")} />
          )}
          {phase === "onboarding" && (
            <OnboardingView onComplete={() => setPhase("auth")} />
          )}
          {phase === "auth" && (
            <AuthView
              onSuccess={handleAuthSuccess}
              onGuestContinue={() => setPhase("name-setup")}
            />
          )}
          {phase === "name-setup" && (
            <NameSetupView
              initialName={profile.name}
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

          {/* Core App */}
          {phase === "home" && (
            <HomeView
              userName={profile.name}
              selectedEmotion={selectedEmotion}
              onSelectEmotion={setSelectedEmotion}
              streak={profile.streak}
              onNavigate={(screen) => {
                if (screen === 'notifications') {
                  setPhase('notification-inbox' as ScreenState);
                } else {
                  setPhase(screen as ScreenState);
                }
              }}
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

          {/* Subscreens */}
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

      {showVoiceModal && (
        <VoiceModalView onClose={() => setShowVoiceModal(false)} />
      )}

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