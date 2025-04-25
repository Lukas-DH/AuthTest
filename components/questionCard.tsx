import React, { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface QuestionCardProps {
  title: string;
  description: string;
  children?: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  isLastQuestion?: boolean;
  nextDisabled?: boolean;
}

export default function QuestionCard({
  title,
  description,
  children,
  onNext,
  onBack,
  isLastQuestion,
  nextDisabled,
}: QuestionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.content}>{children}</View>
      {onNext && (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            nextDisabled && styles.buttonDisabled,
          ]}
          onPress={onNext}
          disabled={nextDisabled}
        >
          <Text style={styles.buttonText}>
            {isLastQuestion ? "Submit" : "Next"}
          </Text>
        </Pressable>
      )}
      {onBack && (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={onBack}
        >
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
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
    justifyContent: "center",
    marginTop: 10,
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
