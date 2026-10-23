import React, { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
const USE_NATIVE_DRIVER = Platform.OS !== "web";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
  Ellipse,
  Rect,
  Polygon,
  Line,
  G,
  Text as SvgText,
  Defs,
  RadialGradient,
  Stop,
} from "react-native-svg";
import {
  Mic,
  MicOff,
  Volume2,
  PhoneOff,
  Bell,
  TrendingUp,
  X,
  Play,
  Pause,
  ArrowRight,
  Flame,
  MessageCircle,
  Star,
  Check,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Moon,
  Sun,
  Sparkles,
  Shield,
  Info,
  BookOpen,
  Mail,
  Download,
  Trash2,
  AlertTriangle,
} from "lucide-react-native";

import { Colors } from "@/constants/colors";
import { GENDER_OPTIONS } from "@/constants/genders";
import { LANGUAGES } from "@/constants/languages";
import { StorageService } from "@/services/storage";
import { AiService } from "@/services/ai";
import {
  ScreenState,
  ChatMessage,
  JournalRecord,
  UserProfileData,
} from "@/types";

// Modular UI Components
import { GlowingOrb } from "@/components/common/GlowingOrb";
import { BackHeader } from "@/components/common/BackHeader";
import { BottomNavDock } from "@/components/common/BottomNavDock";
import { EmotionGrid } from "@/components/home/EmotionGrid";
import { QuickActions } from "@/components/home/QuickActions";
import { WeeklyChartCard } from "@/components/home/WeeklyChartCard";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { QuickChips } from "@/components/chat/QuickChips";
import { ChatInputBar } from "@/components/chat/ChatInputBar";
import { HistoryItem } from "@/components/journal/HistoryItem";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { GradientButton } from "@/components/ui/GradientButton";

const { width } = Dimensions.get("window");

const ONBOARD_PAGES = [
  {
    heading: "You're Never Alone",
    desc: "Share your thoughts, feelings, worries, dreams, or victories — anytime, without judgment.",
    cta: "Continue",
  },
  {
    heading: "Understands Your Feelings",
    desc: "Aura recognizes emotional context and responds with empathy, kindness, and understanding.",
    cta: "Continue",
  },
  {
    heading: "Remembers What Matters",
    desc: "Important moments, goals, and conversations stay connected so every interaction feels meaningful.",
    cta: "Continue",
  },
  {
    heading: "Available Anytime",
    desc: "Text, voice, or simply sit together in silence. Aura is always here for you.",
    cta: "Get Started",
  },
];

const MEDITATE_SESSIONS = [
  {
    emoji: "🌿",
    title: "Forest Calm",
    duration: "5 min",
    category: "Anxiety",
    color: "#34D399",
  },
  {
    emoji: "🌊",
    title: "Ocean Breath",
    duration: "10 min",
    category: "Stress",
    color: "#60A5FA",
  },
  {
    emoji: "🌙",
    title: "Sleep Prep",
    duration: "15 min",
    category: "Sleep",
    color: "#818CF8",
  },
  {
    emoji: "☀️",
    title: "Morning Energy",
    duration: "7 min",
    category: "Focus",
    color: "#FBBF24",
  },
  {
    emoji: "💜",
    title: "Self-Compassion",
    duration: "12 min",
    category: "Anxiety",
    color: "#C4B5FD",
  },
];

// ─── SVG Onboarding Illustrations ─────────────────────────────────────────────
function OnboardIllustration({ step }: { step: number }) {
  if (step === 0) {
    return (
      <Svg viewBox="0 0 320 240" style={{ width: "100%", height: 210 }}>
        <Defs>
          <RadialGradient id="g0a" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#818CF8" stopOpacity="0.45" />
            <Stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="g0b" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#A78BFA" />
            <Stop offset="65%" stopColor="#6366F1" />
            <Stop offset="100%" stopColor="#4F46E5" />
          </RadialGradient>
        </Defs>
        <Circle cx="185" cy="115" r="70" fill="url(#g0a)" opacity={0.35} />
        <Circle cx="185" cy="115" r="44" fill="url(#g0b)" opacity={0.92} />
        <Circle cx="185" cy="115" r="22" fill="#fff" opacity={0.3} />
        <Circle cx="185" cy="115" r="10" fill="#fff" opacity={0.8} />
        <Ellipse
          cx="100"
          cy="165"
          rx="30"
          ry="42"
          fill="rgba(129,140,248,0.18)"
        />
        <Circle cx="100" cy="115" r="24" fill="rgba(129,140,248,0.28)" />
        <Rect
          x="125"
          y="105"
          width="36"
          height="20"
          rx="10"
          fill="rgba(99,102,241,0.6)"
        />
        <Polygon points="125,112 116,118 125,121" fill="rgba(99,102,241,0.6)" />
        <Rect
          x="205"
          y="85"
          width="56"
          height="24"
          rx="12"
          fill="rgba(167,139,250,0.5)"
        />
        <Polygon points="205,94 196,98 205,102" fill="rgba(167,139,250,0.5)" />
        <SvgText
          x="233"
          y="102"
          textAnchor="middle"
          fontSize="11"
          fill="rgba(255,255,255,0.85)"
        >
          Hi! 💙
        </SvgText>
      </Svg>
    );
  }
  if (step === 1) {
    return (
      <Svg viewBox="0 0 320 240" style={{ width: "100%", height: 210 }}>
        <Circle cx="160" cy="120" r="62" fill="rgba(99,102,241,0.14)" />
        <Circle cx="88" cy="82" r="32" fill="#EC4899" opacity={0.28} />
        <Circle cx="195" cy="72" r="27" fill="#818CF8" opacity={0.28} />
        <Circle cx="214" cy="148" r="30" fill="#34D399" opacity={0.28} />
        <Circle cx="96" cy="162" r="24" fill="#F59E0B" opacity={0.28} />
        <Circle cx="160" cy="120" r="38" fill="#A78BFA" opacity={0.35} />
        <Line
          x1="88"
          y1="82"
          x2="160"
          y2="120"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          strokeDasharray="5,4"
        />
        <Line
          x1="195"
          y1="72"
          x2="160"
          y2="120"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          strokeDasharray="5,4"
        />
        <Line
          x1="214"
          y1="148"
          x2="160"
          y2="120"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          strokeDasharray="5,4"
        />
        <Line
          x1="96"
          y1="162"
          x2="160"
          y2="120"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          strokeDasharray="5,4"
        />
      </Svg>
    );
  }
  if (step === 2) {
    const nodes = [
      { y: 55, color: "#EC4899", label: "Birthday", left: true },
      { y: 100, color: "#818CF8", label: "Goal set", left: false },
      { y: 148, color: "#34D399", label: "Win!", left: true },
      { y: 195, color: "#F59E0B", label: "Milestone", left: false },
    ];
    return (
      <Svg viewBox="0 0 320 240" style={{ width: "100%", height: 210 }}>
        <Line
          x1="160"
          y1="28"
          x2="160"
          y2="218"
          stroke="rgba(129,140,248,0.35)"
          strokeWidth="2"
        />
        <Circle cx="160" cy="120" r="66" fill="rgba(99,102,241,0.08)" />
        {nodes.map((n, i) => (
          <G key={i}>
            <Circle cx="160" cy={n.y} r="18" fill={n.color} opacity={0.25} />
            <Circle cx="160" cy={n.y} r="10" fill={n.color} opacity={0.65} />
            <SvgText
              x={n.left ? 130 : 190}
              y={n.y + 4}
              textAnchor={n.left ? "end" : "start"}
              fontSize="12"
              fill="rgba(255,255,255,0.65)"
            >
              {n.label}
            </SvgText>
            <Line
              x1={n.left ? 148 : 172}
              y1={n.y}
              x2={n.left ? 136 : 184}
              y2={n.y}
              stroke={n.color}
              strokeOpacity="0.6"
              strokeWidth="1.5"
            />
          </G>
        ))}
      </Svg>
    );
  }
  return (
    <Svg viewBox="0 0 320 240" style={{ width: "100%", height: 210 }}>
      <Circle cx="160" cy="120" r="68" fill="rgba(99,102,241,0.12)" />
      <Circle cx="160" cy="120" r="48" fill="rgba(139,92,246,0.22)" />
      <Circle cx="160" cy="120" r="30" fill="rgba(236,72,153,0.28)" />
      <Circle cx="160" cy="120" r="16" fill="rgba(255,255,255,0.45)" />
      <Circle
        cx="160"
        cy="120"
        r="55"
        stroke="rgba(129,140,248,0.28)"
        strokeWidth="1.2"
        strokeDasharray="4,4"
      />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <Circle
            key={i}
            cx={160 + 55 * Math.cos(rad)}
            cy={120 + 55 * Math.sin(rad)}
            r="4.5"
            fill="rgba(129,140,248,0.55)"
          />
        );
      })}
      <Line
        x1="160"
        y1="120"
        x2="160"
        y2="84"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Line
        x1="160"
        y1="120"
        x2="186"
        y2="120"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// ─── Main Root Component ──────────────────────────────────────────────────────
export default function Index() {
  const [phase, setPhase] = useState<ScreenState>("splash");
  const [onboardStep, setOnboardStep] = useState(0);
  const [provider, setProvider] = useState<"google" | "apple">("google");
  const [profile, setProfile] = useState<UserProfileData>({
    name: "Tanmay",
    email: "tanmay@aura.ai",
    gender: "man",
    streak: 14,
    sessions: 32,
    memories: 68,
    isPremium: false,
  });

  // Home states
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(
    "Happy",
  );

  // Chat states
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hey Tanmay! 👋 How are you feeling today?",
      role: "ai",
      time: "10:30 AM",
    },
    {
      id: "2",
      text: "Feeling a bit stressed about work...",
      role: "user",
      time: "10:31 AM",
    },
    {
      id: "3",
      text: "I hear you. Work stress can feel really heavy sometimes. Would you like to talk about what's going on? I'm fully here for you 💙",
      role: "ai",
      time: "10:32 AM",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Journal states
  const [journalTab, setJournalTab] = useState<"today" | "history">("today");
  const [journals, setJournals] = useState<JournalRecord[]>([]);

  // Meditation states
  const [meditateActive, setMeditateActive] = useState(false);

  // Settings states
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [fontSize, setFontSize] = useState("Medium");
  const [selectedLang, setSelectedLang] = useState("en");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [termsTab, setTermsTab] = useState<"privacy" | "terms">("privacy");

  const [notifToggles, setNotifToggles] = useState({
    checkIn: true,
    mood: true,
    achieve: true,
    insights: false,
    meditation: false,
    streak: true,
  });

  const [privacyToggles, setPrivacyToggles] = useState({
    shareData: false,
    analytics: true,
    personalizedAi: true,
    biometrics: false,
  });

  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(0);

  // Initial load
  useEffect(() => {
    StorageService.getProfile().then(setProfile);
    StorageService.getJournals().then(setJournals);
  }, []);

  // 2-second splash timer
  const fadeAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (phase === "splash") {
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          setPhase("onboarding");
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text,
      role: "user",
      time: "Now",
    };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setChatInput("");

    const aiReply = await AiService.sendMessage(
      updatedHistory,
      text,
      selectedEmotion || undefined,
    );
    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        text: aiReply,
        role: "ai",
        time: "Now",
      },
    ]);
  };

  const isMainTab = ["home", "chat", "journal", "insights", "profile"].includes(
    phase,
  );

  return (
    <SafeAreaView style={styles.canvasContainer}>
      <View style={{ flex: 1 }}>
        {/* 1. Splash Screen */}
        {phase === "splash" && (
          <Animated.View style={[styles.splashWrapper, { opacity: fadeAnim }]}>
            <View style={styles.splashCenter}>
              <GlowingOrb size={110} />
              <Text style={styles.brandTitle}>Aura</Text>
              <Text style={styles.brandTagline}>
                ALWAYS HERE. ALWAYS LISTENING.
              </Text>
            </View>
            <Text style={styles.splashFooter}>
              Your companion for every emotion.
            </Text>
          </Animated.View>
        )}

        {/* 2. Onboarding Screen */}
        {phase === "onboarding" && (
          <View style={styles.onboardWrapper}>
            <View style={styles.topBarRow}>
              <View />
              <TouchableOpacity onPress={() => setPhase("auth")}>
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.graphicCenterArea}>
              <OnboardIllustration step={onboardStep} />
            </View>
            <View style={styles.bottomCardArea}>
              <Text style={styles.cardHeading}>
                {ONBOARD_PAGES[onboardStep].heading}
              </Text>
              <Text style={styles.cardDesc}>
                {ONBOARD_PAGES[onboardStep].desc}
              </Text>
              <View style={styles.navBottomRow}>
                <View style={styles.dotsTrack}>
                  {ONBOARD_PAGES.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dotItem,
                        i === onboardStep
                          ? styles.dotActive
                          : styles.dotInactive,
                      ]}
                    />
                  ))}
                </View>
                <GradientButton
                  label={ONBOARD_PAGES[onboardStep].cta}
                  onPress={() => {
                    if (onboardStep < ONBOARD_PAGES.length - 1) {
                      setOnboardStep((s) => s + 1);
                    } else {
                      setPhase("auth");
                    }
                  }}
                  icon={<ArrowRight size={16} color="#fff" />}
                />
              </View>
            </View>
          </View>
        )}

        {/* 3. Auth Screen */}
        {phase === "auth" && (
          <View style={styles.authWrapper}>
            <View style={styles.authHeader}>
              <GlowingOrb size={70} />
              <Text style={styles.authTitle}>Aura</Text>
              <Text style={styles.authSub}>Welcome — let's get started</Text>
            </View>
            <View style={styles.authButtonsStack}>
              <TouchableOpacity
                style={styles.authButton}
                onPress={() => {
                  setProvider("google");
                  setPhase("name-setup");
                }}
              >
                <Text style={styles.authButtonIcon}>G</Text>
                <Text style={styles.authButtonText}>Continue with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.authButton}
                onPress={() => {
                  setProvider("apple");
                  setPhase("name-setup");
                }}
              >
                <Text style={styles.authButtonEmoji}>🍎</Text>
                <Text style={styles.authButtonText}>Continue with Apple</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.termsFooter}>
              <Text style={styles.termsNormalText}>
                By continuing, you agree to our{" "}
                <Text style={styles.termsLinkText}>Terms & Privacy Policy</Text>
              </Text>
            </View>
          </View>
        )}

        {/* 4. Name Setup Screen */}
        {phase === "name-setup" && (
          <View style={styles.setupWrapper}>
            <View style={styles.providerBadge}>
              <Text style={styles.providerBadgeText}>
                {provider === "google" ? "G" : "🍎"}
              </Text>
            </View>
            <Text style={styles.setupHeading}>What should we call you?</Text>
            <Text style={styles.setupSub}>
              Your name is pre-filled. Feel free to customize it.
            </Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>DISPLAY NAME</Text>
              <TextInput
                value={profile.name}
                onChangeText={(text) =>
                  setProfile((p) => ({ ...p, name: text }))
                }
                placeholder="Enter your name"
                placeholderTextColor="rgba(255,255,255,0.35)"
                style={styles.setupTextInput}
              />
              <Text style={styles.inputHelper}>
                This is how Aura will address you in conversations.
              </Text>
            </View>
            <View style={{ flex: 1 }} />
            <GradientButton
              label="Continue"
              onPress={() => setPhase("gender-select")}
              disabled={!profile.name.trim()}
              icon={<ArrowRight size={16} color="#fff" />}
            />
          </View>
        )}

        {/* 5. Gender Identity Screen */}
        {phase === "gender-select" && (
          <View style={styles.setupWrapper}>
            <Text style={styles.setupHeading}>How do you identify?</Text>
            <Text style={styles.setupSub}>
              Aura uses this to personalize your experience with care and
              respect.
            </Text>
            <ScrollView
              style={{ flex: 1, marginVertical: 12 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.genderGrid}>
                {GENDER_OPTIONS.map((item) => {
                  const active = profile.gender === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() =>
                        setProfile((p) => ({ ...p, gender: item.id }))
                      }
                      style={[
                        styles.genderCard,
                        active && styles.genderCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.genderCardSymbol,
                          active && { color: "#C4B5FD" },
                        ]}
                      >
                        {item.symbol}
                      </Text>
                      <Text
                        style={[
                          styles.genderCardLabel,
                          active && { color: "#fff" },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
            <GradientButton
              label="Get Started"
              onPress={() => setPhase("home")}
              icon={<ArrowRight size={16} color="#fff" />}
            />
          </View>
        )}

        {/* 6. Home Screen */}
        {phase === "home" && (
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={{ paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.subGreeting}>Good morning</Text>
                <Text style={styles.mainGreeting}>{profile.name} 👋</Text>
              </View>
              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => setPhase("notifications")}
              >
                <Bell size={20} color="#F8FAFC" />
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center", marginVertical: 16 }}>
              <GlowingOrb size={96} />
              <Text style={[styles.bodyText, { marginTop: 12 }]}>
                How are you feeling today?
              </Text>
            </View>
            <EmotionGrid
              selectedEmotion={selectedEmotion}
              onSelectEmotion={setSelectedEmotion}
            />
            <Text style={styles.sectionHeader}>QUICK ACTIONS</Text>
            <QuickActions onNavigate={setPhase} />
            <View style={styles.statsTwoColRow}>
              <View style={styles.statMiniCard}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Flame size={16} color="#FBBF24" />
                  <Text style={styles.statMiniTitle}>Streak</Text>
                </View>
                <Text style={styles.statBigNumber}>{profile.streak}</Text>
                <Text style={styles.statMiniSub}>days in a row</Text>
              </View>
              <View style={styles.statMiniCard}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <TrendingUp size={16} color="#34D399" />
                  <Text style={styles.statMiniTitle}>Avg Mood</Text>
                </View>
                <Text style={styles.statBigNumber}>7.8</Text>
                <Text style={[styles.statMiniSub, { color: "#34D399" }]}>
                  ↑ Better this week
                </Text>
              </View>
            </View>
            <WeeklyChartCard onViewAll={() => setPhase("insights")} />
          </ScrollView>
        )}

        {/* 7. Chat Screen */}
        {phase === "chat" && (
          <View style={styles.paddedContainer}>
            <View style={styles.chatTopBar}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View style={styles.aiSparkleBadge}>
                  <Sparkles size={16} color="#fff" />
                </View>
                <View>
                  <Text style={styles.chatHeaderName}>Aura</Text>
                  <Text style={styles.chatHeaderStatus}>
                    ▪ Always here for you
                  </Text>
                </View>
              </View>
            </View>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingVertical: 14 }}
            >
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </ScrollView>
            <QuickChips onSelectChip={handleSendMessage} />
            <ChatInputBar
              input={chatInput}
              onChangeInput={setChatInput}
              onSend={() => handleSendMessage()}
            />
          </View>
        )}

        {/* 8. Voice Screen */}
        {phase === "voice" && (
          <View style={styles.voiceWrapper}>
            <View style={styles.voiceHeaderRow}>
              <View style={styles.voiceStatusChip}>
                <Text style={styles.voiceStatusText}>🎙 Listening...</Text>
              </View>
              <TouchableOpacity
                onPress={() => setPhase("home")}
                style={styles.voiceCloseSquare}
              >
                <X size={18} color="#F8FAFC" />
              </TouchableOpacity>
            </View>
            <View style={styles.detectedEmotionBadge}>
              <Text style={styles.detectedEmotionText}>😌 Calm detected</Text>
            </View>
            <View style={styles.voiceOrbCenterArea}>
              <GlowingOrb size={150} />
            </View>
            <Text style={styles.voiceTranscriptText}>
              I'm listening... share what's on your mind.
            </Text>
            <View style={styles.callControlsRow}>
              <TouchableOpacity style={styles.callCircleBtn}>
                <MicOff size={22} color="#fff" />
                <Text style={styles.callCircleLabel}>Mute</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.callCircleBtn,
                  { backgroundColor: Colors.danger },
                ]}
                onPress={() => setPhase("home")}
              >
                <PhoneOff size={22} color="#fff" />
                <Text style={styles.callCircleLabel}>End</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.callCircleBtn}>
                <Volume2 size={22} color="#fff" />
                <Text style={styles.callCircleLabel}>Speaker</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 9. Journal Screen */}
        {phase === "journal" && (
          <View style={styles.paddedContainer}>
            <Text style={styles.journalDateLabel}>Thursday, October 22</Text>
            <Text style={styles.journalMainHeading}>Daily Journal</Text>
            <View style={styles.tabToggleTrack}>
              <TouchableOpacity
                onPress={() => setJournalTab("today")}
                style={[
                  styles.tabTogglePill,
                  journalTab === "today" && styles.tabToggleActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabToggleLabel,
                    journalTab === "today" && { color: "#fff" },
                  ]}
                >
                  Today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setJournalTab("history")}
                style={[
                  styles.tabTogglePill,
                  journalTab === "history" && styles.tabToggleActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabToggleLabel,
                    journalTab === "history" && { color: "#fff" },
                  ]}
                >
                  History
                </Text>
              </TouchableOpacity>
            </View>
            {journalTab === "today" ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 110 }}
              >
                <View style={styles.journalCardBox}>
                  <Text style={styles.journalSectionTitle}>
                    How's your mood?
                  </Text>
                  <View style={styles.moodEmojiRow}>
                    {["😊", "😔", "😡", "😌", "😰", "❤️"].map((emo, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.moodEmojiPill,
                          idx === 0 && styles.moodEmojiPillSelected,
                        ]}
                      >
                        <Text style={{ fontSize: 20 }}>{emo}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                {[
                  { prompt: "What made you smile today?", icon: "😊" },
                  { prompt: "What challenged you today?", icon: "💪" },
                  { prompt: "What are you grateful for?", icon: "🙏" },
                ].map((item, idx) => (
                  <View key={idx} style={styles.journalPromptBox}>
                    <Text style={styles.promptLabel}>
                      {item.icon} {item.prompt}
                    </Text>
                    <TextInput
                      placeholder="Write something..."
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      style={styles.promptInput}
                    />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 110 }}
              >
                {journals.map((j) => (
                  <HistoryItem key={j.id} entry={j} />
                ))}
              </ScrollView>
            )}
          </View>
        )}

        {/* 10. Insights Screen */}
        {phase === "insights" && (
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={{ paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.insightsScreenHeading}>Mood Insights</Text>
            <View style={styles.topStatsRow}>
              <View style={styles.statMetricCard}>
                <TrendingUp size={16} color="#34D399" />
                <Text style={styles.statMetricValue}>7.8</Text>
                <Text style={styles.statMetricLabel}>Avg Mood</Text>
              </View>
              <View style={styles.statMetricCard}>
                <Flame size={16} color="#FBBF24" />
                <Text style={styles.statMetricValue}>14d</Text>
                <Text style={styles.statMetricLabel}>Streak</Text>
              </View>
              <View style={styles.statMetricCard}>
                <MessageCircle size={16} color="#818CF8" />
                <Text style={styles.statMetricValue}>32</Text>
                <Text style={styles.statMetricLabel}>Sessions</Text>
              </View>
            </View>
          </ScrollView>
        )}

        {/* 11. Meditate Screen */}
        {phase === "meditate" && (
          <View style={styles.paddedContainer}>
            <BackHeader title="Meditate" onBack={() => setPhase("home")} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 110 }}
            >
              <View style={styles.breathingCircleContainer}>
                <View style={styles.breathOrbOuter}>
                  <View style={styles.breathOrbInner}>
                    <Text style={styles.breathStatusLabel}>
                      {meditateActive ? "Inhale..." : "Ready"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.breathSubPrompt}>
                  Start your breathing exercise
                </Text>
                <TouchableOpacity
                  style={styles.playPauseCircleBtn}
                  onPress={() => setMeditateActive(!meditateActive)}
                >
                  {meditateActive ? (
                    <Pause size={24} color="#fff" />
                  ) : (
                    <Play size={24} color="#fff" fill="#fff" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.sectionHeader}>GUIDED SESSIONS</Text>
              {MEDITATE_SESSIONS.map((sess) => (
                <TouchableOpacity
                  key={sess.title}
                  style={styles.sessionCardItem}
                >
                  <View style={styles.sessionEmojiSquare}>
                    <Text style={{ fontSize: 20 }}>{sess.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sessionCardTitle}>{sess.title}</Text>
                    <Text style={styles.sessionCardSub}>
                      {sess.duration} ·{" "}
                      <Text style={{ color: sess.color }}>{sess.category}</Text>
                    </Text>
                  </View>
                  <Play size={18} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 12. Profile Screen */}
        {phase === "profile" && (
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={{ paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.profileHeaderBox}>
              <View style={styles.profileAvatarLarge}>
                <Text style={{ fontSize: 36 }}>🧑</Text>
              </View>
              <Text style={styles.profileNameBold}>{profile.name}</Text>
              <Text style={styles.profileEmailSub}>{profile.email}</Text>
              <TouchableOpacity
                style={styles.upgradeGoldButton}
                onPress={() => setPhase("subscription")}
              >
                <Star size={14} color="#fff" fill="#fff" />
                <Text style={styles.upgradeGoldText}>Upgrade to Premium</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>PREFERENCES</Text>
            <View style={styles.settingsBlockGroup}>
              <TouchableOpacity
                style={styles.settingItemRow}
                onPress={() => setPhase("appearance")}
              >
                <Text style={styles.settingItemLabel}>Appearance</Text>
                <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingItemRow}
                onPress={() => setPhase("language")}
              >
                <Text style={styles.settingItemLabel}>Language</Text>
                <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingItemRow}
                onPress={() => setPhase("notifications")}
              >
                <Text style={styles.settingItemLabel}>Notifications</Text>
                <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>PRIVACY</Text>
            <View style={styles.settingsBlockGroup}>
              <TouchableOpacity
                style={styles.settingItemRow}
                onPress={() => setPhase("privacy")}
              >
                <Text style={styles.settingItemLabel}>Privacy Settings</Text>
                <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingItemRow}
                onPress={() => setPhase("export-memories")}
              >
                <Text style={styles.settingItemLabel}>Export Memories</Text>
                <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingItemRow}
                onPress={() => setPhase("delete-memories")}
              >
                <Text
                  style={[styles.settingItemLabel, { color: Colors.danger }]}
                >
                  Delete Memories
                </Text>
                <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>ACCOUNT</Text>
            <View style={styles.settingsBlockGroup}>
              <TouchableOpacity
                style={styles.settingItemRow}
                onPress={() => setPhase("subscription")}
              >
                <Text style={styles.settingItemLabel}>Subscription</Text>
                <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingItemRow}
                onPress={() => setPhase("help")}
              >
                <Text style={styles.settingItemLabel}>Help & Support</Text>
                <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingItemRow}
                onPress={() => setPhase("about")}
              >
                <Text style={styles.settingItemLabel}>About Aura</Text>
                <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingItemRow}
                onPress={() => setPhase("terms")}
              >
                <Text style={styles.settingItemLabel}>
                  Terms & Privacy Policy
                </Text>
                <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* 13. Subscription Screen */}
        {phase === "subscription" && (
          <View style={styles.paddedContainer}>
            <BackHeader
              title="Subscription"
              onBack={() => setPhase("profile")}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.premiumCardContainer}>
                <Text style={styles.premiumGoldTitle}>PREMIUM</Text>
                <Text style={styles.rupeePricingText}>₹299</Text>
                <Text style={styles.perMonthSubText}>per month</Text>
                {[
                  "Unlimited chat conversations",
                  "Unlimited voice minutes",
                  "Advanced mood analytics",
                  "PDF/JSON Memory Export",
                ].map((feat, i) => (
                  <View key={i} style={styles.benefitRowItem}>
                    <Check size={16} color="#34D399" />
                    <Text style={styles.benefitRowText}>{feat}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.upgradeOrangeBtn}
                  onPress={() =>
                    Alert.alert(
                      "Store Billing",
                      "Initiating App Store / Play Store wallet...",
                    )
                  }
                >
                  <Text style={styles.upgradeOrangeBtnText}>
                    Upgrade to Premium
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}

        {/* 14. Appearance Screen */}
        {phase === "appearance" && (
          <View style={styles.paddedContainer}>
            <BackHeader title="Appearance" onBack={() => setPhase("profile")} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.prefSectionHeader}>THEME</Text>
              <View style={styles.themeSelectorRow}>
                {[
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "light", label: "Light", icon: Sun },
                  { id: "auto", label: "Auto", icon: Sparkles },
                ].map((item) => {
                  const active = selectedTheme === item.id;
                  const Icon = item.icon;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => setSelectedTheme(item.id)}
                      style={[
                        styles.themeOptionCard,
                        active && styles.themeOptionCardActive,
                      ]}
                    >
                      <Icon
                        size={20}
                        color={active ? "#818CF8" : "rgba(255,255,255,0.5)"}
                      />
                      <Text
                        style={[
                          styles.themeOptionText,
                          active && { color: "#818CF8" },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        {/* 15. Language Screen */}
        {phase === "language" && (
          <View style={styles.paddedContainer}>
            <BackHeader title="Language" onBack={() => setPhase("profile")} />
            <ScrollView showsVerticalScrollIndicator={false}>
              {LANGUAGES.map((l) => {
                const active = selectedLang === l.code;
                return (
                  <TouchableOpacity
                    key={l.code}
                    onPress={() => setSelectedLang(l.code)}
                    style={[
                      styles.langChoiceCard,
                      active && styles.langChoiceCardActive,
                    ]}
                  >
                    <View>
                      <Text style={styles.langNameMain}>{l.name}</Text>
                      <Text style={styles.langNameSub}>{l.native}</Text>
                    </View>
                    {active && <Check size={18} color="#818CF8" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* 16. Notifications Settings */}
        {phase === "notifications" && (
          <View style={styles.paddedContainer}>
            <BackHeader
              title="Notifications"
              onBack={() => setPhase("profile")}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                {
                  key: "checkIn",
                  label: "Daily Check-in",
                  sub: "Morning reminder to log your mood",
                },
                {
                  key: "mood",
                  label: "Mood Reminders",
                  sub: "Gentle nudges throughout the day",
                },
                {
                  key: "streak",
                  label: "Streak Alerts",
                  sub: "Keep your journaling streak alive",
                },
              ].map((item) => {
                const isOn =
                  notifToggles[item.key as keyof typeof notifToggles];
                return (
                  <View key={item.key} style={styles.notifToggleRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.notifRowLabel}>{item.label}</Text>
                      <Text style={styles.notifRowSub}>{item.sub}</Text>
                    </View>
                    <ToggleSwitch
                      value={isOn}
                      onToggle={() =>
                        setNotifToggles((prev) => ({
                          ...prev,
                          [item.key]: !isOn,
                        }))
                      }
                    />
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* 17. Privacy Screen */}
        {phase === "privacy" && (
          <View style={styles.paddedContainer}>
            <BackHeader
              title="Privacy Settings"
              onBack={() => setPhase("profile")}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.cardGroup}>
                {[
                  {
                    key: "shareData",
                    label: "Share Usage Data",
                    sub: "Help improve Aura anonymously",
                  },
                  {
                    key: "analytics",
                    label: "Analytics",
                    sub: "Allow crash diagnostics",
                  },
                ].map((item) => {
                  const isOn =
                    privacyToggles[item.key as keyof typeof privacyToggles];
                  return (
                    <View key={item.key} style={styles.toggleItemRow}>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={styles.itemTitle}>{item.label}</Text>
                        <Text style={styles.itemSub}>{item.sub}</Text>
                      </View>
                      <ToggleSwitch
                        value={isOn}
                        onToggle={() =>
                          setPrivacyToggles((prev) => ({
                            ...prev,
                            [item.key]: !isOn,
                          }))
                        }
                      />
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        {/* 18. Export Memories Screen */}
        {phase === "export-memories" && (
          <View style={styles.paddedContainer}>
            <BackHeader
              title="Export Memories"
              onBack={() => setPhase("profile")}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.prefSectionHeader}>FORMAT</Text>
              <View style={styles.formatSelectRow}>
                {["PDF", "JSON", "CSV"].map((fmt) => (
                  <TouchableOpacity key={fmt} style={styles.formatBox}>
                    <Text style={styles.formatTitle}>{fmt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <GradientButton
                label="Export Now"
                onPress={() =>
                  Alert.alert("Exporting", "Preparing your download archive...")
                }
                style={{ marginTop: 20 }}
              />
            </ScrollView>
          </View>
        )}

        {/* 19. Delete Memories Screen */}
        {phase === "delete-memories" && (
          <View style={styles.paddedContainer}>
            <BackHeader
              title="Delete Memories"
              onBack={() => setPhase("profile")}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.dangerWarningBox}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <AlertTriangle size={20} color={Colors.danger} />
                  <Text style={styles.dangerWarningTitle}>
                    This action is irreversible
                  </Text>
                </View>
                <Text style={styles.dangerWarningBody}>
                  Deleting your memories permanently removes all journal entries
                  and chat sessions.
                </Text>
              </View>
              <Text style={styles.confirmPromptText}>
                Type{" "}
                <Text style={{ color: Colors.danger, fontWeight: "700" }}>
                  DELETE
                </Text>{" "}
                to confirm
              </Text>
              <TextInput
                value={deleteConfirmation}
                onChangeText={setDeleteConfirmation}
                placeholder="Type DELETE here"
                placeholderTextColor="rgba(255,255,255,0.3)"
                style={styles.deleteConfirmInput}
              />
              <TouchableOpacity
                disabled={deleteConfirmation.trim().toUpperCase() !== "DELETE"}
                style={[
                  styles.deleteFinalButton,
                  deleteConfirmation.trim().toUpperCase() !== "DELETE" && {
                    opacity: 0.4,
                  },
                ]}
                onPress={async () => {
                  await StorageService.clearAllMemories();
                  setJournals([]);
                  Alert.alert("Purged", "Your memories have been erased.");
                  setPhase("profile");
                }}
              >
                <Trash2 size={18} color={Colors.danger} />
                <Text style={styles.deleteFinalButtonText}>
                  Delete All Memories
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* 20. Help & Support */}
        {phase === "help" && (
          <View style={styles.paddedContainer}>
            <BackHeader
              title="Help & Support"
              onBack={() => setPhase("profile")}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.supportCardsRow}>
                <TouchableOpacity style={styles.supportBox}>
                  <MessageCircle size={20} color="#818CF8" />
                  <Text style={styles.supportBoxTitle}>Live Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.supportBox}>
                  <Mail size={20} color="#34D399" />
                  <Text style={styles.supportBoxTitle}>Email Us</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}

        {/* 21. About Aura */}
        {phase === "about" && (
          <View style={styles.paddedContainer}>
            <BackHeader title="About Aura" onBack={() => setPhase("profile")} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ alignItems: "center", marginVertical: 20 }}>
                <GlowingOrb size={80} />
                <Text style={styles.aboutAppTitle}>Aura</Text>
                <Text style={styles.aboutAppVersion}>Version 2.4.1</Text>
              </View>
            </ScrollView>
          </View>
        )}

        {/* 22. Terms & Privacy */}
        {phase === "terms" && (
          <View style={styles.paddedContainer}>
            <BackHeader
              title="Terms & Privacy"
              onBack={() => setPhase("profile")}
            />
            <View style={styles.tabToggleTrack}>
              <TouchableOpacity
                onPress={() => setTermsTab("privacy")}
                style={[
                  styles.tabTogglePill,
                  termsTab === "privacy" && styles.tabToggleActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabToggleLabel,
                    termsTab === "privacy" && { color: "#fff" },
                  ]}
                >
                  Privacy Policy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTermsTab("terms")}
                style={[
                  styles.tabTogglePill,
                  termsTab === "terms" && styles.tabToggleActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabToggleLabel,
                    termsTab === "terms" && { color: "#fff" },
                  ]}
                >
                  Terms of Service
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  lineHeight: 20,
                }}
              >
                {termsTab === "privacy"
                  ? "Your emotional records and journal entries remain encrypted locally on your device. We do not sell your personal data."
                  : "By accessing Aura, you acknowledge that Aura is an AI wellness space, not a medical or emergency crisis service."}
              </Text>
            </ScrollView>
          </View>
        )}
      </View>

      {/* Floating 5-Tab Navigation Dock */}
      {isMainTab && (
        <BottomNavDock activeScreen={phase} onNavigate={setPhase} />
      )}
    </SafeAreaView>
  );
}

// ─── Stylesheet ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  paddedContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  splashWrapper: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
  },
  splashCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 50,
    fontWeight: "900",
    color: "#E0E7FF",
    marginTop: 22,
    letterSpacing: -0.5,
  },
  brandTagline: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    letterSpacing: 2.8,
    marginTop: 6,
    fontWeight: "600",
  },
  splashFooter: {
    color: "rgba(255,255,255,0.32)",
    fontSize: 13,
  },
  onboardWrapper: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 24,
  },
  topBarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 30,
  },
  skipButtonText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    fontWeight: "500",
  },
  graphicCenterArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomCardArea: {
    paddingBottom: 10,
  },
  cardHeading: {
    color: "#F8FAFC",
    fontSize: 27,
    fontWeight: "800",
    lineHeight: 34,
    marginBottom: 8,
  },
  cardDesc: {
    color: "rgba(255,255,255,0.52)",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 28,
  },
  navBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dotsTrack: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dotItem: {
    height: 7,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: "#818CF8",
  },
  dotInactive: {
    width: 7,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  authWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  authHeader: {
    alignItems: "center",
    marginBottom: 36,
  },
  authTitle: {
    fontSize: 38,
    fontWeight: "900",
    color: "#F8FAFC",
    marginTop: 18,
  },
  authSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 14,
    marginTop: 6,
  },
  authButtonsStack: {
    gap: 14,
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 22,
  },
  authButtonIcon: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    marginRight: 16,
    width: 22,
    textAlign: "center",
  },
  authButtonEmoji: {
    fontSize: 18,
    marginRight: 16,
    width: 22,
    textAlign: "center",
  },
  authButtonText: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "600",
  },
  termsFooter: {
    marginTop: 34,
    alignItems: "center",
  },
  termsNormalText: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 12,
    textAlign: "center",
  },
  termsLinkText: {
    color: "#818CF8",
    textDecorationLine: "underline",
  },
  setupWrapper: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 20,
  },
  providerBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(99,102,241,0.22)",
    borderColor: "rgba(129,140,248,0.35)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  providerBadgeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  setupHeading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F8FAFC",
    marginBottom: 8,
  },
  setupSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    lineHeight: 20,
    marginBottom: 28,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: "700",
  },
  setupTextInput: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: "#F8FAFC",
    fontSize: 16,
  },
  inputHelper: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 12,
    marginTop: 4,
  },
  genderGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  genderCard: {
    width: (width - 66) / 2,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  genderCardActive: {
    borderColor: "#818CF8",
    backgroundColor: "rgba(99,102,241,0.22)",
  },
  genderCardSymbol: {
    fontSize: 20,
    color: "rgba(255,255,255,0.5)",
  },
  genderCardLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontWeight: "600",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  subGreeting: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
  },
  mainGreeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  bodyText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
  },
  sectionHeader: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: 14,
    marginBottom: 8,
  },
  statsTwoColRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  statMiniCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  statMiniTitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "600",
  },
  statBigNumber: {
    fontSize: 32,
    fontWeight: "900",
    color: "#F8FAFC",
    marginTop: 4,
  },
  statMiniSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    marginTop: 2,
  },
  chatTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  aiSparkleBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#818CF8",
    justifyContent: "center",
    alignItems: "center",
  },
  chatHeaderName: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },
  chatHeaderStatus: {
    color: "#34D399",
    fontSize: 11,
  },
  voiceWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    alignItems: "center",
  },
  voiceHeaderRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  voiceStatusChip: {
    backgroundColor: "rgba(129,140,248,0.15)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  voiceStatusText: {
    color: "#C4B5FD",
    fontSize: 12,
  },
  voiceCloseSquare: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  detectedEmotionBadge: {
    backgroundColor: "rgba(52,211,153,0.12)",
    borderColor: "rgba(52,211,153,0.25)",
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 5,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  detectedEmotionText: {
    color: "#34D399",
    fontSize: 12,
    fontWeight: "600",
  },
  voiceOrbCenterArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  voiceTranscriptText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 18,
  },
  callControlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    marginBottom: 20,
  },
  callCircleBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  callCircleLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 10,
    marginTop: 4,
  },
  journalDateLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
  },
  journalMainHeading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#F8FAFC",
    marginBottom: 14,
  },
  tabToggleTrack: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 3,
    marginBottom: 16,
  },
  tabTogglePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: "center",
  },
  tabToggleActive: {
    backgroundColor: "#818CF8",
  },
  tabToggleLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
    fontWeight: "600",
  },
  journalCardBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 12,
  },
  journalSectionTitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    marginBottom: 10,
  },
  moodEmojiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moodEmojiPill: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  moodEmojiPillSelected: {
    borderColor: "#818CF8",
    borderWidth: 1.5,
    backgroundColor: "rgba(129,140,248,0.2)",
  },
  journalPromptBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 10,
  },
  promptLabel: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  promptInput: {
    color: "#fff",
    fontSize: 14,
  },
  insightsScreenHeading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#F8FAFC",
    marginBottom: 14,
  },
  topStatsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statMetricCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 4,
  },
  statMetricValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  statMetricLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
  },
  breathingCircleContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  breathOrbOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(99,102,241,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  breathOrbInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#818CF8",
    justifyContent: "center",
    alignItems: "center",
  },
  breathStatusLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  breathSubPrompt: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    marginTop: 18,
    marginBottom: 20,
  },
  playPauseCircleBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  sessionCardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  sessionEmojiSquare: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  sessionCardTitle: {
    color: "#F8FAFC",
    fontWeight: "600",
    fontSize: 15,
  },
  sessionCardSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    marginTop: 2,
  },
  profileHeaderBox: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  profileNameBold: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  profileEmailSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
    marginTop: 2,
  },
  upgradeGoldButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#D97706",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 16,
  },
  upgradeGoldText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  settingsBlockGroup: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    overflow: "hidden",
  },
  settingItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  settingItemLabel: {
    color: "#F8FAFC",
    fontSize: 15,
  },
  premiumCardContainer: {
    backgroundColor: "rgba(99,102,241,0.15)",
    borderColor: "rgba(129,140,248,0.35)",
    borderWidth: 1.5,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  premiumGoldTitle: {
    color: "#FBBF24",
    fontWeight: "800",
    fontSize: 13,
  },
  rupeePricingText: {
    fontSize: 40,
    fontWeight: "900",
    color: "#F8FAFC",
    marginTop: 10,
  },
  perMonthSubText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginBottom: 16,
  },
  benefitRowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  benefitRowText: {
    color: "#F8FAFC",
    fontSize: 13,
  },
  upgradeOrangeBtn: {
    backgroundColor: "#EA580C",
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 14,
  },
  upgradeOrangeBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  prefSectionHeader: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    letterSpacing: 1.5,
    marginTop: 16,
    marginBottom: 10,
    fontWeight: "700",
  },
  themeSelectorRow: {
    flexDirection: "row",
    gap: 10,
  },
  themeOptionCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  themeOptionCardActive: {
    borderColor: "#818CF8",
    backgroundColor: "rgba(99,102,241,0.2)",
  },
  themeOptionText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: "600",
  },
  accentColorsPalette: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 4,
  },
  colorCircleSwatch: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: "#fff",
  },
  langChoiceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  langChoiceCardActive: {
    borderColor: "#818CF8",
    backgroundColor: "rgba(99,102,241,0.2)",
  },
  langNameMain: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "600",
  },
  langNameSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    marginTop: 2,
  },
  notifToggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  notifRowLabel: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "600",
  },
  notifRowSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    marginTop: 2,
  },
  cardGroup: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  toggleItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  itemTitle: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "600",
  },
  itemSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    marginTop: 2,
  },
  formatSelectRow: {
    flexDirection: "row",
    gap: 10,
  },
  formatBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  formatTitle: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
  },
  dangerWarningBox: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderColor: "rgba(239,68,68,0.3)",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  dangerWarningTitle: {
    color: "#F87171",
    fontSize: 15,
    fontWeight: "700",
  },
  dangerWarningBody: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12.5,
    lineHeight: 18,
  },
  confirmPromptText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginTop: 18,
    marginBottom: 8,
  },
  deleteConfirmInput: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 14,
    color: "#F87171",
    fontSize: 14,
    fontWeight: "700",
  },
  deleteFinalButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239,68,68,0.25)",
    borderWidth: 1,
    borderColor: "#EF4444",
    paddingVertical: 15,
    borderRadius: 18,
    marginTop: 20,
    marginBottom: 40,
  },
  deleteFinalButtonText: {
    color: "#F87171",
    fontWeight: "700",
    fontSize: 14,
  },
  supportCardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  supportBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    gap: 6,
  },
  supportBoxTitle: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "700",
  },
  aboutAppTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#F8FAFC",
    marginTop: 10,
  },
  aboutAppVersion: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    marginTop: 4,
  },
});
