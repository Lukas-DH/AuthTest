import React, { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OnboardingCardProps {
  title: string;
  description: string;
  children?: ReactNode;
  buttonText?: string;
  onNext?: (event: GestureResponderEvent) => void;
  buttonDisabled?: boolean;
}

export default function OnboardingCard({
  title,
  description,
  children,
  buttonText = "Next",
  onNext,
  buttonDisabled = false,
}: OnboardingCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.content}>{children}</View>
      {onNext && (
        <View style={styles.footer}>
          <Pressable
            onPress={onNext}
            disabled={buttonDisabled}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              buttonDisabled && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color="#FFF"
              style={styles.icon}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  header: { marginBottom: 10 },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#047857",
  },
  description: {
    fontSize: 14,
    color: "#475569",
    marginTop: 4,
  },
  content: {
    marginVertical: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#059669",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonPressed: {
    backgroundColor: "#047857",
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    marginLeft: 8,
  },
});
