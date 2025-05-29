import React, { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

interface QuestionCardProps {
  title: string;
  description: string;
  sex?: string;
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
  sex,
  isLastQuestion,
  nextDisabled,
}: QuestionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {title}
          <Text style={styles.description}>
            {description}
            {"\n"}
          </Text>
        </Text>
      </View>
      <Text
        style={[
          styles.badge,
          sex === "male" && { backgroundColor: "#dbeafe" }, // light blue
          sex === "female" && { backgroundColor: "#fce7f3" }, // light pink
        ]}
      >
        {sex === "male" ? "Monsieur" : "Madame"}
      </Text>

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
            {isLastQuestion ? "Soumettre" : "Suivant"}
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
          <Text style={styles.buttonText}>Retour</Text>
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
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "500",
    overflow: "hidden",
    marginTop: 4,
  },
});
