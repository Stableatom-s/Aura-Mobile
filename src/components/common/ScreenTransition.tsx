import React, { useEffect, useRef, ReactNode } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';

interface ScreenTransitionProps {
  screenKey: string;
  children: ReactNode;
  duration?: number;
}

export function ScreenTransition({
  screenKey,
  children,
  duration = 900, // Smooth transition duration (~1 second)
}: ScreenTransitionProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(14)).current;
  const scaleAnim = useRef(new Animated.Value(0.985)).current;

  useEffect(() => {
    // Reset to initial entry coordinates
    fadeAnim.setValue(0);
    translateYAnim.setValue(14);
    scaleAnim.setValue(0.985);

    // Run parallel organic ease curve
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Standard cubic-bezier smooth deceleration
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
    ]).start();
  }, [screenKey]);

  return (
    <Animated.View
      style={[
        styles.fill,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});