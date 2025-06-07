import React from "react";
import { View, Text, StyleSheet } from "react-native";

// this fucntion is used to display the summary of the responses given by the user after submitting the form.

interface ResponseSummaryProps {
  responses: Record<string, string>;
  questions: { id: string; label: string }[];
}

export default function ResponseSummary({
  responses,
  questions,
}: ResponseSummaryProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Your Responses (EXAMPLE - Can add this)</Text>
      {questions.map((q) => (
        <View key={q.id} style={styles.responseItem}>
          <Text style={styles.questionLabel}>{q.label}</Text>
          <Text style={styles.answerText}>
            {responses[q.id] || "No response"}
          </Text>
        </View>
      ))}
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
    marginBottom: 12,
  },
  responseItem: {
    marginBottom: 12,
  },
  questionLabel: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 4,
  },
  answerText: {
    fontSize: 16,
    color: "#475569",
    fontWeight: "500",
  },
});
