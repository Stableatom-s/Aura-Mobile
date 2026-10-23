import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

export function GlowingOrb({ size = 110 }: { size?: number }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    // Smooth 3.2s rhythmic breathing cycle (inhale expand -> hold/exhale return)
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.14,
            duration: 1600,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: USE_NATIVE_DRIVER,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.65,
            duration: 1600,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: USE_NATIVE_DRIVER,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 1600,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: USE_NATIVE_DRIVER,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.35,
            duration: 1600,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: USE_NATIVE_DRIVER,
          }),
        ]),
      ])
    ).start();
  }, [pulseAnim, glowOpacity]);

  return (
    <View style={[styles.wrapper, { width: size * 1.5, height: size * 1.5 }]}>
      {/* 1. Deep midnight-blue diffuse outer aura */}
      <Animated.View
        style={[
          styles.outerHalo,
          {
            width: size * 1.45,
            height: size * 1.45,
            borderRadius: (size * 1.45) / 2,
            opacity: glowOpacity,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* 2. Soft indigo/purple middle diffuse ring */}
      <Animated.View
        style={[
          styles.middleHalo,
          {
            width: size * 1.05,
            height: size * 1.05,
            borderRadius: (size * 1.05) / 2,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* 3. Core purple iris ring */}
      <Animated.View
        style={[
          styles.innerIris,
          {
            width: size * 0.68,
            height: size * 0.68,
            borderRadius: (size * 0.68) / 2,
          },
        ]}
      >
        <LinearGradient
          colors={['#818CF8', '#6366F1', '#4F46E5']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />

        {/* 4. Glowing white-violet center pupil core */}
        <View
          style={[
            styles.brightCore,
            {
              width: size * 0.32,
              height: size * 0.32,
              borderRadius: (size * 0.32) / 2,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerHalo: {
    position: 'absolute',
    backgroundColor: '#1E1B4B', // Deep indigo-blue aura
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 40,
    elevation: 15,
  },
  middleHalo: {
    position: 'absolute',
    backgroundColor: '#312E81',
    opacity: 0.75,
  },
  innerIris: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#818CF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 20,
    elevation: 20,
  },
  brightCore: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#C4B5FD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 25,
  },
});