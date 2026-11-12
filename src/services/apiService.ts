import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For physical phone testing: run `ipconfig` in cmd to get your IPv4 address (e.g. 192.168.1.X)
// For Android emulator: 10.0.2.2 works automatically
const DEV_LAN_IP = '192.168.1.100';
const USE_PHYSICAL_DEVICE = false; // set to true if testing on a real phone via Expo Go

const BASE_URL = Platform.select({
  android: USE_PHYSICAL_DEVICE ? `http://${DEV_LAN_IP}:5000/api` : 'http://10.0.2.2:5000/api',
  ios: 'http://localhost:5000/api',
  default: 'http://localhost:5000/api',
});

const TOKEN_KEY = '@aura_session_token';

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

    const data = await res.json();
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

    const data = await res.json();
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
    }
  ) {
    const res = await fetch(`${BASE_URL}/auth/profile/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
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
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
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
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
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
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
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

      xhr.onprogress = () => {
        const newData = xhr.responseText.substring(seenBytes);
        seenBytes = xhr.responseText.length;

        const lines = newData.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const payload = line.replace('data: ', '').trim();
            if (payload === '[DONE]') {
              return;
            }
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
              // Ignore incomplete JSON fragments until next progress event
            }
          }
        }
      };

      xhr.onload = () => {
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