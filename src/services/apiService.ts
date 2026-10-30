import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For Android emulator use 10.0.2.2, for web use localhost, for physical device use your computer's local IP (e.g. 192.168.1.X)
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api',
  ios: 'http://localhost:5000/api',
  default: 'http://localhost:5000/api',
});

const TOKEN_KEY = '@aura_session_token';

export const apiService = {
  async setToken(token: string) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async getToken() {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  async clearToken() {
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
};