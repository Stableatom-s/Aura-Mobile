import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalRecord, UserProfileData } from '@/types';

const STORAGE_KEYS = {
  USER_PROFILE: 'aura_user_profile',
  JOURNALS: 'aura_journals',
};

export const DEFAULT_PROFILE: UserProfileData = {
  name: 'User',
  email: '',
  gender: '',
  onboardingCompleted: false,
  streak: 0,
  sessions: 0,
  memories: 0,
  isPremium: false,
};

export const StorageService = {
  async getProfile(): Promise<UserProfileData> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  async saveProfile(profile: UserProfileData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile:', e);
    }
  },

  async clearProfile(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    } catch (e) {
      console.warn('Failed to clear profile:', e);
    }
  },

  async getJournals(): Promise<JournalRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.JOURNALS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveJournals(entries: JournalRecord[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(entries));
    } catch (e) {
      console.warn('Failed to save journals:', e);
    }
  },

  async saveJournal(entry: JournalRecord): Promise<void> {
    try {
      const existing = await StorageService.getJournals();
      const updated = [entry, ...existing];
      await AsyncStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save journal entry:', e);
    }
  },

  async clearAllMemories(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.JOURNALS);
    } catch (e) {
      console.warn('Failed to clear memories:', e);
    }
  },
};