import React, { ReactNode, useState } from "react";
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
  const [isChecked, setIsChecked] = useState(false);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.content}>{children}</View>
      {/* Custom Checkbox Row */}
      <View style={styles.checkboxRow}>
        <Pressable
          onPress={() => setIsChecked(!isChecked)}
          style={{
            height: 24,
            width: 24,
            borderWidth: 1,
            borderColor: "#64748b",
            marginRight: 8,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isChecked ? "#059669" : "#fff",
          }}
        >
          {isChecked && (
            <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>
          )}
        </Pressable>
        <Text style={{ fontSize: 14, color: "#475569" }}>
          Les deux membres du couples{" "}
          <Text
            style={[
              styles.badge,
              { backgroundColor: "#F3E3F9", color: "#065f46" },
            ]}
          >
            Madame
          </Text>{" "}
          et{" "}
          <Text
            style={[
              styles.badge,
              { backgroundColor: "#EAF2FB", color: "#065f46" },
            ]}
          >
            Monsieur
          </Text>{" "}
          doivent être présents ensemble pour remplir ce questionnaire 
        </Text>
      </View>
      {onNext && (
        <View style={styles.footer}>
          <Pressable
            onPress={onNext}
            disabled={buttonDisabled || !isChecked}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              (buttonDisabled || !isChecked) && styles.buttonDisabled,
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
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
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
