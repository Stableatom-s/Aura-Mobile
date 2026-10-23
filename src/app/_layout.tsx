import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Platform } from "react-native";
import { Colors } from "@/constants/colors";

export default function RootLayout() {
  return (
    <View style={styles.rootContainer}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: "fade",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    ...(Platform.OS === "web" ? { height: "100vh" as any } : {}),
  },
});