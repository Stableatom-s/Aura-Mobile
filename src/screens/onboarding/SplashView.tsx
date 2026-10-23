
import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Animated, Easing } from "react-native";
import { GlowingOrb } from "@/components/common/GlowingOrb";

export function SplashView({ onNext }: { onNext: () => void }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        onNext();
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [fadeAnim, onNext]);

  return (
    <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
      <View style={styles.center}>
        <GlowingOrb size={110} />
        <Text style={styles.brandTitle}>Aura</Text>
        <Text style={styles.brandTagline}>ALWAYS HERE. ALWAYS LISTENING.</Text>
      </View>
      <Text style={styles.footer}>Your companion for every emotion.</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 50,
    fontWeight: "900",
    color: "#E0E7FF",
    marginTop: 22,
    letterSpacing: -0.5,
  },
  brandTagline: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    letterSpacing: 2.8,
    marginTop: 6,
    fontWeight: "600",
  },
  footer: {
    color: "rgba(255,255,255,0.32)",
    fontSize: 13,
  },
});