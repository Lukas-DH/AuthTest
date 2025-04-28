import React from "react";
// import { View, SafeAreaView, Alert } from "react-native";
import { ResultsCard } from "@/components/resultsCard";
import { Picker } from "@react-native-picker/picker";
import { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
  SafeAreaView,
  Alert,
} from "react-native";

export default function OnboardingScreen() {
  const handleNext = () => {
    Alert.alert("Next button pressed!");
    // Or use console.log("Next button pressed!");
  };

  interface Question {
    id: string;
    advice: string;
    label: string;
    type: "text" | "number" | "boolean" | "choice" | "list";
    unit?: string;
    choices?: string[];
    followUp?: Question[];
    points?: number;
  }

  const [quizJson, setQuizJson] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAtRisk, setIsAtRisk] = useState(false);
  const [riskyResponses, setRiskyResponses] = useState<string[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/quizzes/`
          // "https://nice-agreement-f5d7ffb584.strapiapp.com/api/quizzes/gp18g5pglh6ejbf554m0k9o4"
        );
        const json = await res.json();
        console.log(json);
        setQuizJson(json.data[0].question);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);
  // console.log(quizJson[0].label);
  return (
    <ScrollView style={styles.container}>
      <ResultsCard
        result={{
          riskLevel: "high",
          factors: [
            {
              name: quizJson[0]?.label || "...",
              severity:
                quizJson[0]?.label === "high" || quizJson[0]?.label === "low"
                  ? quizJson[0]?.label
                  : "low",
              description: quizJson[0]?.advice || "...",
              // recommendations: ["..."],
            },
          ],
          // advice: ["Stay healthy.", "Avoid stress."],
          nextSteps: ["Recheck in 3 months.", "Discuss results with doctor."],
        }}
        assessmentDate={new Date()}
        onScheduleReminder={() => Alert.alert("Schedule reminder pressed")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8fafc", flexGrow: 1 },
  content: { maxWidth: 600, width: "100%", alignSelf: "center" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#064e3b",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#475569",
    marginBottom: 20,
  },
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
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#047857",
    marginBottom: 10,
  },
  textGroup: { gap: 10 },
  paragraph: { fontSize: 16, color: "#334155" },
  list: { marginTop: 10, marginBottom: 10 },
  listItem: { fontSize: 16, color: "#334155", marginLeft: 10 },
  note: {
    fontSize: 14,
    color: "#64748b",
    fontStyle: "italic",
    marginTop: 10,
  },
  buttonGroup: { gap: 12 },
  buttonPrimary: {
    backgroundColor: "#059669",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonPrimaryPressed: { backgroundColor: "#047857" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#059669",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonOutlinePressed: { backgroundColor: "#f0fdf4" },
  buttonOutlineText: { color: "#059669", fontSize: 18, fontWeight: "600" },
  consent: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 20,
    textAlign: "center",
  },
});
