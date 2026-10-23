import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Circle,
} from 'react-native-svg';

interface GlowingOrbProps {
  size?: number;
}

export function GlowingOrb({ size = 76 }: GlowingOrbProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // Seamless sinusoidal loop: inhale -> exhale -> immediate smooth restart
    const cycle = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.14,
            duration: 3200,
            easing: Easing.bezier(0.42, 0, 0.58, 1), // Perfect sine ease-in-out
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 1,
            duration: 3200,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 3200,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.85,
            duration: 3200,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    cycle.start();

    return () => cycle.stop();
  }, [pulseAnim, glowOpacity]);

  const canvasSize = size * 2.5; // Expanded canvas so bright halo feathering never clips
  const centerCoord = canvasSize / 2;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: canvasSize,
          height: canvasSize,
          transform: [{ scale: pulseAnim }],
          opacity: glowOpacity,
        },
      ]}
    >
      <Svg height={canvasSize} width={canvasSize} viewBox={`0 0 ${canvasSize} ${canvasSize}`}>
        <Defs>
          {/* Outer Ambient Atmosphere - High Luminance Violet/Indigo */}
          <RadialGradient
            id="outerAmbientGlow"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor="#A78BFA" stopOpacity="0.65" />
            <Stop offset="35%" stopColor="#818CF8" stopOpacity="0.38" />
            <Stop offset="70%" stopColor="#6366F1" stopOpacity="0.14" />
            <Stop offset="100%" stopColor="#0A0D18" stopOpacity="0" />
          </RadialGradient>

          {/* Core Radial Gradient - Crisp, Ultra-Luminous Lavender & Magenta */}
          <RadialGradient
            id="innerCoreGradient"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="14%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <Stop offset="30%" stopColor="#F5D0FE" stopOpacity="0.94" />
            <Stop offset="50%" stopColor="#E879F9" stopOpacity="0.82" />
            <Stop offset="72%" stopColor="#A855F7" stopOpacity="0.55" />
            <Stop offset="88%" stopColor="#6366F1" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#0A0D18" stopOpacity="0" />
          </RadialGradient>

          {/* Highlight Flare */}
          <RadialGradient
            id="centerFlare"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* 1. Feathered Wide Ambient Glow */}
        <Circle
          cx={centerCoord}
          cy={centerCoord}
          r={centerCoord}
          fill="url(#outerAmbientGlow)"
        />

        {/* 2. Concentric Vibrant Body */}
        <Circle
          cx={centerCoord}
          cy={centerCoord}
          r={size * 0.88}
          fill="url(#innerCoreGradient)"
        />

        {/* 3. Concentrated Pure White Center Star */}
        <Circle
          cx={centerCoord}
          cy={centerCoord}
          r={size * 0.35}
          fill="url(#centerFlare)"
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
});