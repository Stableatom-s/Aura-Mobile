import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalRecord, UserProfileData } from '@/types';

const STORAGE_KEYS = {
  USER_PROFILE: 'aura_user_profile',
  JOURNALS: 'aura_journals',
};

const DEFAULT_PROFILE: UserProfileData = {
  name: 'Tanmay',
  email: 'tanmay@aura.ai',
  gender: 'man',
  streak: 14,
  sessions: 32,
  memories: 68,
  isPremium: false,
};

const INITIAL_JOURNALS: JournalRecord[] = [
  {
    id: 1,
    date: 'Monday, Oct 20',
    mood: '😊',
    title: 'Productive & energized',
    preview: 'Had a peaceful and focused day. Finished my work early and recharged...',
    words: 124,
  },
  {
    id: 2,
    date: 'Sunday, Oct 19',
    mood: '😌',
    title: 'Restful Sunday',
    preview: 'Spent the day reading and resting with quiet music...',
    words: 89,
  },
  {
    id: 3,
    date: 'Saturday, Oct 18',
    mood: '😰',
    title: 'Overstimulated afternoon',
    preview: 'Crowded spaces drained my battery. Needed quiet time to reset...',
    words: 156,
  },
];

export const StorageService = {
  async getProfile(): Promise<UserProfileData> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
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

  async getJournals(): Promise<JournalRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.JOURNALS);
      return data ? JSON.parse(data) : INITIAL_JOURNALS;
    } catch {
      return INITIAL_JOURNALS;
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