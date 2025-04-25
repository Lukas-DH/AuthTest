import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Define the AssessmentResult interface
interface AssessmentResult {
  riskLevel: "low" | "high" | "high";
  factors: {
    name: string;
    severity: "low" | "high" | "high";
    description: string;
    recommendations: string[];
  }[];
  advice: string[];
  nextSteps: string[];
}

interface ResultsCardProps {
  result: AssessmentResult;
  assessmentDate: Date;
  nextAssessmentDate?: Date;
  onScheduleReminder: () => void;
}

export function ResultsCard({
  result,
  assessmentDate,
  nextAssessmentDate,
  onScheduleReminder,
}: ResultsCardProps) {
  const getBadgeStyle = (level: "low" | "moderate" | "high") => {
    switch (level) {
      case "low":
        return [styles.badge, { backgroundColor: "#d1fae5", color: "#065f46" }];
      case "moderate":
        return [styles.badge, { backgroundColor: "#fef3c7", color: "#92400e" }];
      case "high":
        return [styles.badge, { backgroundColor: "#fee2e2", color: "#991b1b" }];
      default:
        return styles.badge;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Assessment Results</Text>
        <Text style={getBadgeStyle(result.riskLevel)}>
          {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)}{" "}
          Risk
        </Text>
        <Text style={styles.description}>
          Assessment completed {assessmentDate.toDateString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="warning" size={18} color="#f59e0b" /> Identified Risk
          Factors
        </Text>
        {result.factors.map((factor, idx) => (
          <View key={idx} style={styles.factor}>
            <View style={styles.factorHeader}>
              <Text style={styles.factorName}>{factor.name}</Text>
              <Text style={getBadgeStyle(factor.severity)}>
                {factor.severity}
              </Text>
            </View>
            <Text style={styles.factorDescription}>{factor.description}</Text>
            {factor.recommendations.length > 0 && (
              <View>
                <Text style={styles.recommendationTitle}>Recommendations:</Text>
                {factor.recommendations.map((rec, i) => (
                  <Text key={i} style={styles.recommendationText}>
                    • {rec}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="information-circle" size={18} color="#047857" />{" "}
          Personalized Advice
        </Text>
        {result.advice.map((advice, idx) => (
          <Text key={idx} style={styles.textItem}>
            • {advice}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="calendar" size={18} color="#047857" /> Next Steps
        </Text>
        {result.nextSteps.map((step, idx) => (
          <Text key={idx} style={styles.textItem}>
            • {step}
          </Text>
        ))}
      </View>

      {nextAssessmentDate && (
        <View style={styles.assessmentBox}>
          <Text style={styles.assessmentText}>
            <Ionicons name="time" size={16} color="#047857" /> Follow-up
            scheduled for {nextAssessmentDate.toDateString()}
          </Text>
        </View>
      )}

      {!nextAssessmentDate && (
        <View style={styles.footer}>
          <Pressable
            onPress={onScheduleReminder}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Schedule 3-Month Follow-up</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color="#FFF"
              style={styles.icon}
            />
          </Pressable>
        </View>
      )}
    </ScrollView>
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
  header: { marginBottom: 16 },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#047857",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#475569",
    marginTop: 4,
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
  section: { marginVertical: 10 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 6,
  },
  factor: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  factorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  factorName: { fontWeight: "600", color: "#047857" },
  factorDescription: { fontSize: 14, color: "#475569", marginBottom: 4 },
  recommendationTitle: { fontWeight: "500", marginTop: 4 },
  recommendationText: { fontSize: 14, color: "#1f2937" },
  textItem: { fontSize: 14, color: "#1f2937", marginBottom: 4 },
  assessmentBox: {
    backgroundColor: "#ecfdf5",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    borderColor: "#a7f3d0",
    borderWidth: 1,
  },
  assessmentText: { color: "#065f46", fontSize: 14 },
  footer: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    marginLeft: 8,
  },
});
