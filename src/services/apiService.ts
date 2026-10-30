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
};