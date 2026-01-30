import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { theme } from "@/lib/theme";

export function PrimaryButton({
  title,
  onPress,
  tone = "primary"
}: {
  title: string;
  onPress: () => void;
  tone?: "primary" | "gold";
}) {
  const bgColor = tone === "gold" ? theme.gold : theme.brandAccent;
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bgColor, opacity: pressed ? 0.8 : 1 }
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center"
  },
  text: {
    color: "#000",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 0.5
  }
});
