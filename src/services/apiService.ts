import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Set EXPO_PUBLIC_API_URL in root .env (e.g. http://192.168.1.15:5001/api) for physical devices
const DEV_LAN_IP = '192.168.1.100';
const USE_PHYSICAL_DEVICE = true;

const FALLBACK_BASE_URL = Platform.select({
  android: USE_PHYSICAL_DEVICE ? `http://${DEV_LAN_IP}:5001/api` : 'http://10.0.2.2:5001/api',
  ios: 'http://localhost:5001/api',
  default: 'http://localhost:5001/api',
});

export const BASE_URL = (process.env.EXPO_PUBLIC_API_URL || FALLBACK_BASE_URL!).replace(/\/$/, '');

const TOKEN_KEY = '@aura_session_token';

async function parseJsonSafe(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Server returned non-JSON response (${res.status}): ${text.slice(0, 120)}`);
  }
}

export const apiService = {
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  async clearToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  // ─── Authentication & Profile ───
  async authenticateWithGoogle(idToken: string) {
    const res = await fetch(`${BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const data = await parseJsonSafe(res);
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to authenticate with Google');
    }

    if (data.token) {
      await this.setToken(data.token);
    }

    return data;
  },

  async authenticateWithApple(
    identityToken: string,
    userMetadata?: { name?: { firstName?: string; lastName?: string } }
  ) {
    const res = await fetch(`${BASE_URL}/auth/apple`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identityToken, user: userMetadata }),
    });

    const data = await parseJsonSafe(res);
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to authenticate with Apple');
    }

    if (data.token) {
      await this.setToken(data.token);
    }

    return data;
  },

  async updateProfile(
    userId: string,
    data: {
      fullName?: string;
      gender?: string;
      dateOfBirth?: { month: string; day: number; year: number };
      preferences?: {
        theme?: 'dark' | 'light' | 'auto';
        accentColor?: string;
        fontSize?: 'small' | 'medium' | 'large';
        language?: 'en' | 'hi';
        dailyReminders?: boolean;
        hapticFeedback?: boolean;
      };
    }
  ) {
    const token = await this.getToken();
    const res = await fetch(`${BASE_URL}/auth/profile/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });

    const resData = await parseJsonSafe(res);
    if (!res.ok || !resData.success) {
      throw new Error(resData.message || 'Failed to update profile');
    }
    return resData;
  },

  // ─── Journal Cloud Sync ───
  async getJournalEntries() {
    const token = await this.getToken();
    const res = await fetch(`${BASE_URL}/journal`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await parseJsonSafe(res);
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch journal entries');
    }
    return data;
  },

  async createJournalEntry(data: {
    emotion: string;
    reflectionText: string;
    tags?: string[];
    sentimentScore?: number;
  }) {
    const token = await this.getToken();
    const res = await fetch(`${BASE_URL}/journal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });

    const resData = await parseJsonSafe(res);
    if (!res.ok || !resData.success) {
      throw new Error(resData.message || 'Failed to save journal entry');
    }
    return resData;
  },

  async deleteJournalEntry(entryId: string) {
    const token = await this.getToken();
    const res = await fetch(`${BASE_URL}/journal/${entryId}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await parseJsonSafe(res);
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete journal entry');
    }
    return data;
  },

  // ─── Gemini AI Streaming Chat ───
  async streamChatMessage(
    params: {
      message: string;
      moodContext?: string | null;
      conversationHistory?: Array<{ sender: 'user' | 'ai'; text: string }>;
    },
    onChunk: (chunkText: string) => void
  ): Promise<void> {
    const token = await this.getToken();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE_URL}/chat/stream`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      let seenBytes = 0;
      let sseBuffer = '';

      const processBuffer = (flushAll = false) => {
        const lines = sseBuffer.split('\n');
        sseBuffer = flushAll ? '' : lines.pop() || '';

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line.startsWith('data: ')) continue;

          const payload = line.slice(6).trim();
          if (!payload || payload === '[DONE]') continue;

          try {
            const parsed = JSON.parse(payload);
            if (parsed.error) {
              reject(new Error(parsed.error));
              return;
            }
            if (parsed.text) {
              onChunk(parsed.text);
            }
          } catch {
            // Re-buffer incomplete JSON payload if not flushing
            if (!flushAll) {
              sseBuffer = `${rawLine}\n${sseBuffer}`;
            }
          }
        }
      };

      xhr.onprogress = () => {
        const newData = xhr.responseText.substring(seenBytes);
        seenBytes = xhr.responseText.length;
        sseBuffer += newData;
        processBuffer(false);
      };

      xhr.onload = () => {
        const remaining = xhr.responseText.substring(seenBytes);
        if (remaining) {
          sseBuffer += remaining;
        }
        processBuffer(true);

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Chat stream failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error while streaming AI response'));
      };

      xhr.send(JSON.stringify(params));
    });
  },
};