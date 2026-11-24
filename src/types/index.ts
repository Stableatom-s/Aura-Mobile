export type ScreenState =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'name-setup'
  | 'gender-select'
  | 'home'
  | 'chat'
  | 'voice'
  | 'journal'
  | 'insights'
  | 'profile'
  | 'meditate'
  | 'appearance'
  | 'language'
  | 'notifications'
  | 'notification-inbox'
  | 'privacy'
  | 'export-memories'
  | 'delete-memories'
  | 'subscription'
  | 'help'
  | 'about'
  | 'terms';

export interface EmotionItem {
  emoji: string;
  label: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

export interface JournalRecord {
  id: string | number;
  date: string;
  mood: string;
  title: string;
  preview: string;
  words: number;
}

export interface DateOfBirth {
  month: string;
  day: number;
  year: number;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  language: 'en' | 'hi';
  dailyReminders: boolean;
  hapticFeedback: boolean;
}

export interface UserProfileData {
  id?: string;
  name: string;
  email: string;
  gender: string;
  avatarUrl?: string;
  dateOfBirth?: DateOfBirth;
  onboardingCompleted?: boolean;
  preferences?: UserPreferences;
  streak: number;
  sessions: number;
  memories: number;
  isPremium: boolean;
}