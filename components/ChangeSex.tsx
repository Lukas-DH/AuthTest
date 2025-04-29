import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface ChangeSexCardProps {
  sex: "male" | "female";
  onConfirm: () => void;
}

export default function ChangeSexCard({ sex, onConfirm }: ChangeSexCardProps) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Changement de section</Text>
      <Text style={styles.description}>
        Les questions suivantes concernent:{" "}
        <Text style={styles.sexHighlight}>
          {sex === "male" ? (
            <>
              {" "}
              <Text
                style={[
                  styles.badge,
                  { backgroundColor: "#EAF2FB", color: "#065f46" },
                ]}
              >
                Partenaire masculin
              </Text>
            </>
          ) : (
            <Text
              style={[
                styles.badge,
                { backgroundColor: "#F3E3F9", color: "#065f46" },
              ]}
            >
              Partenaire féminin
            </Text>
          )}
        </Text>{" "}
      </Text>

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
        <Text style={{ fontSize: 14, color: "#334155" }}>
          J'ai compris que les prochaines questions concernent{" "}
          {sex === "male" ? "le partenaire masculin" : "le partenaire féminin"}.
        </Text>
      </View>

      <Pressable
        onPress={onConfirm}
        disabled={!isChecked}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          !isChecked && { opacity: 0.5 },
        ]}
      >
        <Text style={styles.buttonText}>Continuer</Text>
      </Pressable>
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
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#047857",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 10,
  },
  sexHighlight: {
    fontWeight: "700",
    color: "#065f46",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
