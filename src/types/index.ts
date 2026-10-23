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
  | 'meditate'
  | 'subscription'
  | 'appearance'
  | 'language'
  | 'notifications'
  | 'notification-inbox'
  | 'privacy'
  | 'export-memories'
  | 'delete-memories'
  | 'help'
  | 'about'
  | 'terms'
  | 'profile';

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
  id: number;
  date: string;
  mood: string;
  title: string;
  preview: string;
  words: number;
}

export interface UserProfileData {
  name: string;
  email: string;
  gender: string;
  streak: number;
  sessions: number;
  memories: number;
  isPremium: boolean;
}