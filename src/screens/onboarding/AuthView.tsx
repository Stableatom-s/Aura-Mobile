import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Animated,
  Easing,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient,
  Stop,
  Circle,
  Text as SvgText,
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAppTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID = '18916702954-3ln48501s3gmtan795dld03rt2hgprs3.apps.googleusercontent.com';
const GOOGLE_ANDROID_CLIENT_ID = '18916702954-mo18racbn5r6g8dmr9ne6kap30m81rro.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = '18916702954-edmldikk8idhi86e3m0troht8hmpcdj9.apps.googleusercontent.com';

interface AuthViewProps {
  onSuccess: (userData: any, isNewUser: boolean) => void;
  onGuestContinue?: () => void;
}

function AnimatedLoginOrb({ accentColor }: { accentColor: string }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const haloOpacity = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.14,
            duration: 2400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(haloOpacity, {
            toValue: 0.95,
            duration: 2400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(haloOpacity, {
            toValue: 0.65,
            duration: 2400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [pulseAnim, haloOpacity]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: pulseAnim }],
        opacity: haloOpacity,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width="124" height="124" viewBox="0 0 120 120">
        <Defs>
          <RadialGradient id="loginOrbHalo" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={accentColor} stopOpacity="0.85" />
            <Stop offset="45%" stopColor={accentColor} stopOpacity="0.35" />
            <Stop offset="100%" stopColor="#070814" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="loginOrbCore" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <Stop offset="100%" stopColor={accentColor} stopOpacity="0.3" />
          </RadialGradient>
        </Defs>

        <Circle cx="60" cy="60" r="58" fill="url(#loginOrbHalo)" />
        <Circle cx="60" cy="60" r="24" fill="url(#loginOrbCore)" />
        <Circle cx="60" cy="60" r="7.5" fill="#FFFFFF" />
      </Svg>
    </Animated.View>
  );
}

function AnimatedAuraLogo({ accentColor }: { accentColor: string }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -3,
            duration: 2600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 2,
            duration: 2600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.78,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [floatAnim, glowAnim]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: floatAnim }],
        opacity: glowAnim,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width="160" height="48" viewBox="0 0 160 48">
        <Defs>
          <SvgLinearGradient id="auraLogoShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="50%" stopColor={accentColor} />
            <Stop offset="100%" stopColor="#FFFFFF" />
          </SvgLinearGradient>
        </Defs>
        <SvgText
          x="80"
          y="36"
          fill="url(#auraLogoShimmer)"
          fontSize="40"
          fontWeight="900"
          textAnchor="middle"
          letterSpacing="-0.5"
        >
          Aura
        </SvgText>
      </Svg>
    </Animated.View>
  );
}

export function AuthView({ onSuccess, onGuestContinue }: AuthViewProps) {
  const { colors, fonts, accentColor } = useAppTheme();
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'apple' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectUri = makeRedirectUri({
    scheme: 'aura',
  });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    redirectUri,
  });

  useEffect(() => {
    if (!response) return;

    if (response.type === 'success') {
      const idToken =
        response.params?.id_token ||
        (response as any).authentication?.idToken;

      if (idToken) {
        handleGoogleServerAuth(idToken);
      } else {
        setLoadingProvider(null);
        setErrorMessage('Google authentication succeeded but returned no id_token.');
      }
    } else if (response.type === 'error') {
      setLoadingProvider(null);
      setErrorMessage(response.error?.message || 'Google sign-in was cancelled or failed.');
    } else if (response.type === 'dismiss' || response.type === 'cancel') {
      setLoadingProvider(null);
    }
  }, [response]);

  const handleGoogleServerAuth = async (idToken: string) => {
    try {
      setLoadingProvider('google');
      setErrorMessage(null);
      const result = await apiService.authenticateWithGoogle(idToken);
      onSuccess(result.user, result.isNewUser);
    } catch (err: any) {
      setErrorMessage(err.message || 'Server authentication failed. Verify server connection.');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleGooglePress = () => {
    setErrorMessage(null);
    if (!request) {
      setErrorMessage('Google Auth is initializing. Please tap again in a moment.');
      return;
    }
    setLoadingProvider('google');
    promptAsync();
  };

  const handleApplePress = async () => {
    setErrorMessage(null);
    try {
      setLoadingProvider('apple');
      if (Platform.OS === 'ios') {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });

        if (!credential.identityToken) {
          throw new Error('Apple Sign-In failed to return an identity token.');
        }

        const result = await apiService.authenticateWithApple(credential.identityToken, {
          name: {
            firstName: credential.fullName?.givenName || undefined,
            lastName: credential.fullName?.familyName || undefined,
          },
        });
        onSuccess(result.user, result.isNewUser);
      } else {
        setErrorMessage('Apple sign-in is not supported on Android devices.');
      }
    } catch (err: any) {
      if ((err as any).code !== 'ERR_REQUEST_CANCELED') {
        setErrorMessage(err.message || 'Apple authentication failed.');
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <View style={styles.centerContainer}>
        <View style={styles.brandBlock}>
          <View style={styles.orbWrapper}>
            <AnimatedLoginOrb accentColor={accentColor} />
          </View>
          <View style={styles.titleWrapper}>
            <AnimatedAuraLogo accentColor={accentColor} />
          </View>
          <Text
            style={[
              styles.subGreetingText,
              { fontSize: fonts.caption + 1, color: colors.textSecondary },
            ]}
          >
            Welcome — let’s get started
          </Text>
        </View>

        {errorMessage && (
          <View style={[styles.errorContainer, { borderColor: '#EF444466' }]}>
            <Ionicons name="alert-circle" size={16} color="#EF4444" />
            <Text style={[styles.errorText, { fontSize: fonts.caption }]}>{errorMessage}</Text>
          </View>
        )}

        <View style={styles.buttonStack}>
          <TouchableOpacity
            style={[
              styles.translucentGlassCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={handleGooglePress}
            activeOpacity={0.7}
            disabled={loadingProvider !== null}
          >
            <View style={styles.iconSlot}>
              {loadingProvider === 'google' ? (
                <ActivityIndicator size="small" color={accentColor} />
              ) : (
                <Ionicons name="logo-google" size={19} color={colors.textPrimary} />
              )}
            </View>
            <Text
              style={[
                styles.authButtonText,
                { fontSize: fonts.body, color: colors.textPrimary },
              ]}
            >
              {loadingProvider === 'google' ? 'Connecting to Google...' : 'Continue with Google'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.translucentGlassCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={handleApplePress}
            activeOpacity={0.7}
            disabled={loadingProvider !== null}
          >
            <View style={styles.iconSlot}>
              {loadingProvider === 'apple' ? (
                <ActivityIndicator size="small" color={accentColor} />
              ) : (
                <Ionicons name="logo-apple" size={19} color={colors.textPrimary} />
              )}
            </View>
            <Text
              style={[
                styles.authButtonText,
                { fontSize: fonts.body, color: colors.textPrimary },
              ]}
            >
              {loadingProvider === 'apple' ? 'Connecting to Apple...' : 'Continue with Apple'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.legalFooter}>
          <Text
            style={[
              styles.legalNoticeText,
              { fontSize: fonts.caption, color: colors.textMuted },
            ]}
          >
            By continuing, you agree to our{' '}
            <Text
              style={[styles.termsLink, { color: accentColor }]}
              onPress={() => Linking.openURL('https://aura.ai/terms')}
            >
              Terms & Privacy Policy
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  centerContainer: { flex: 1, paddingHorizontal: 28, justifyContent: 'center' },
  brandBlock: { alignItems: 'center', marginBottom: 36 },
  orbWrapper: { marginBottom: 10, alignItems: 'center', justifyContent: 'center' },
  titleWrapper: { alignItems: 'center', marginBottom: 6 },
  subGreetingText: { fontWeight: '500', letterSpacing: 0.1 },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  errorText: { color: '#EF4444', flex: 1, fontWeight: '500' },
  buttonStack: { gap: 14, marginBottom: 38 },
  translucentGlassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 3,
  },
  iconSlot: { width: 28, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  authButtonText: { fontWeight: '700', letterSpacing: -0.2 },
  legalFooter: { alignItems: 'center', paddingHorizontal: 10 },
  legalNoticeText: { textAlign: 'center', lineHeight: 18 },
  termsLink: { fontWeight: '600', textDecorationLine: 'underline' },
});