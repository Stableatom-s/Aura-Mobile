import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { GlowingOrb } from '@/components/common/GlowingOrb';

interface AuthViewProps {
  onGoogleSignIn: (email: string) => void;
  onAppleSignIn: (email: string) => void;
  onGuestContinue: (email: string) => void;
}

export function AuthView({ onGoogleSignIn, onAppleSignIn, onGuestContinue }: AuthViewProps) {
  const [customEmail, setCustomEmail] = useState('');

  const handleGoogle = () => {
    // In production, this comes from Google OAuth response (e.g., user.email)
    const email = customEmail.trim() || 'user@gmail.com';
    onGoogleSignIn(email);
  };

  const handleApple = () => {
    const email = customEmail.trim() || 'user@icloud.com';
    onAppleSignIn(email);
  };

  const handleGuest = () => {
    onGuestContinue('guest@aura.ai');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <GlowingOrb size={84} />
        <Text style={styles.title}>Welcome to Aura</Text>
        <Text style={styles.subtitle}>Your sanctuary for calm and self-reflection.</Text>
      </View>

      <View style={styles.authGroup}>
        {/* Optional Manual Email Entry for Sandbox/Testing */}
        <TextInput
          placeholder="Enter your email to test"
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={customEmail}
          onChangeText={setCustomEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.emailInput}
        />

        {/* Google Sign In */}
        <TouchableOpacity style={styles.socialBtn} onPress={handleGoogle}>
          <Text style={styles.socialEmoji}>🌐</Text>
          <Text style={styles.socialBtnText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Apple Sign In */}
        <TouchableOpacity style={[styles.socialBtn, styles.appleBtn]} onPress={handleApple}>
          <Text style={styles.socialEmoji}>🍎</Text>
          <Text style={[styles.socialBtnText, { color: '#000000' }]}>Continue with Apple</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Guest Pass */}
        <TouchableOpacity style={styles.guestBtn} onPress={handleGuest}>
          <Text style={styles.guestBtnText}>Explore as Guest</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.termsDisclaimer}>
        By continuing, you agree to Aura's Terms of Service & Privacy Policy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', paddingVertical: 40 },
  header: { alignItems: 'center', marginTop: 40 },
  title: { fontSize: 28, fontWeight: '800', color: '#F8FAFC', marginTop: 24 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 8 },
  authGroup: { gap: 14, width: '100%' },
  emailInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    fontSize: 14,
    marginBottom: 4,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  appleBtn: { backgroundColor: '#FFFFFF' },
  socialEmoji: { fontSize: 18 },
  socialBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  dividerText: { color: 'rgba(255,255,255,0.3)', marginHorizontal: 12, fontSize: 12 },
  guestBtn: { alignItems: 'center', paddingVertical: 12 },
  guestBtnText: { color: '#818CF8', fontSize: 14, fontWeight: '600' },
  termsDisclaimer: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});