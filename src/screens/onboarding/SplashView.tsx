import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Animated, Easing } from "react-native";
import { GlowingOrb } from "@/components/common/GlowingOrb";
import { useAppTheme } from "@/context/ThemeContext";

export function SplashView({ onNext }: { onNext: () => void }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { colors, fonts, accentColor } = useAppTheme();

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
    <Animated.View
      style={[
        styles.wrapper,
        { backgroundColor: colors.background, opacity: fadeAnim },
      ]}
    >
      <View style={styles.center}>
        <GlowingOrb size={110} />
        <Text
          style={[
            styles.brandTitle,
            { color: colors.textPrimary },
          ]}
        >
          Aura
        </Text>
        <Text
          style={[
            styles.brandTagline,
            { fontSize: fonts.caption, color: accentColor },
          ]}
        >
          ALWAYS HERE. ALWAYS LISTENING.
        </Text>
      </View>
      <Text
        style={[
          styles.footer,
          { fontSize: fonts.caption, color: colors.textMuted },
        ]}
      >
        Your companion for every emotion.
      </Text>
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
    marginTop: 22,
    letterSpacing: -0.5,
  },
  brandTagline: {
    letterSpacing: 2.8,
    marginTop: 6,
    fontWeight: "600",
  },
  footer: {
    fontWeight: "500",
  },
});