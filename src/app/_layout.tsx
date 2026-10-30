import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Slot } from 'expo-router';
import { ThemeProvider, useAppTheme } from '../context/ThemeContext';

function RootContainer() {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.rootContainer, { backgroundColor: colors.background }]}>
      <Slot />
    </View>
  );
}

function GestureWrapper({ children }: { children: React.ReactNode }) {
  if (Platform.OS === 'web') {
    return <>{children}</>;
  }

  const { GestureHandlerRootView } = require('react-native-gesture-handler');
  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      {children}
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <GestureWrapper>
        <RootContainer />
      </GestureWrapper>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});