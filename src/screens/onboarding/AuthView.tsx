import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Animated,
  Easing,
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
import { useAppTheme } from '@/context/ThemeContext';

interface AuthViewProps {
  onGoogleSignIn: (email: string) => void;
  onAppleSignIn: (email: string) => void;
  onGuestContinue?: (email: string) => void;
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

export function AuthView({ onGoogleSignIn, onAppleSignIn }: AuthViewProps) {
  const { colors, fonts, accentColor } = useAppTheme();

  const handleGoogle = () => {
    onGoogleSignIn('user@gmail.com');
  };

  const handleApple = () => {
    onAppleSignIn('user@icloud.com');
  };

  const handleOpenTerms = () => {
    Linking.openURL('https://aura.ai/terms');
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <View style={styles.centerContainer}>
        {/* ─── Animated Top Brand Section ─── */}
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
              { fontSize: fonts.caption, color: colors.textSecondary },
            ]}
          >
            Welcome — let’s get started
          </Text>
        </View>

        {/* ─── Dynamic Glass Auth Buttons ─── */}
        <View style={styles.buttonStack}>
          {/* Continue with Google */}
          <TouchableOpacity
            style={[
              styles.translucentGlassCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={handleGoogle}
            activeOpacity={0.7}
          >
            <View style={styles.iconSlot}>
              <Ionicons name="logo-google" size={19} color={colors.textPrimary} />
            </View>
            <Text
              style={[
                styles.authButtonText,
                { fontSize: fonts.body, color: colors.textPrimary },
              ]}
            >
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Continue with Apple */}
          <TouchableOpacity
            style={[
              styles.translucentGlassCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={handleApple}
            activeOpacity={0.7}
          >
            <View style={styles.iconSlot}>
              <Ionicons name="logo-apple" size={19} color={colors.textPrimary} />
            </View>
            <Text
              style={[
                styles.authButtonText,
                { fontSize: fonts.body, color: colors.textPrimary },
              ]}
            >
              Continue with Apple
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── Legal Footer ─── */}
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
              onPress={handleOpenTerms}
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
  safeContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: 44,
  },
  orbWrapper: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    alignItems: 'center',
    marginBottom: 6,
  },
  subGreetingText: {
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  buttonStack: {
    gap: 14,
    marginBottom: 38,
  },
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
  iconSlot: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  authButtonText: {
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  legalFooter: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  legalNoticeText: {
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});