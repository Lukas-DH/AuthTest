import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSession } from "@/components/ctx";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { ResultsCard } from "@/components/resultsCard";
import ResponseSummary from "@/components/responseSummary";
import { generateAdviceFactors } from "@/utils/quizAdvice";

export default function ResultsScreen() {
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [maleCompleted, setMaleCompleted] = useState(false);
  const [femaleCompleted, setFemaleCompleted] = useState(false);
  const [adviceFactors, setAdviceFactors] = useState<any[]>([]);

  const { session, isLoading } = useSession();
  const router = useRouter();
  const user = session ? JSON.parse(session).user : null;

  const questions = [
    { id: "F.1", label: "Quel est votre âge ?" },
    {
      id: "F.9",
      label: "Avez-vous déjà subi une chirurgie au niveau du bas-ventre ?",
    },
    { id: "F.16.1", label: "Lesquelles ? :" },
  ];

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/xresponses?filters[users_permissions_user][id][$eq]=${user.id}&sort=createdAt:desc&pagination[limit]=1`
          // `http://localhost:1337/api/xresponses?filters[users_permissions_user][id][$eq]=${user.id}&sort=createdAt:desc&pagination[limit]=1`
        );
        const json = await response.json();
        if (json.data && json.data.length > 0) {
          const latest = json.data[0];
          const male = latest.answerMale || {};
          const female = latest.answerFemale || {};
          setAnswers({ male, female });

          const combinedAnswers = { ...male, ...female };
          const factors = generateAdviceFactors(combinedAnswers);
          setAdviceFactors(factors);

          const maleScore = male.score ? parseInt(male.score, 10) : 0;
          const femaleScore = female.score ? parseInt(female.score, 10) : 0;
          setScore(maleScore + femaleScore);

          setMaleCompleted(latest.maleCompleted || false);
          setFemaleCompleted(latest.femaleCompleted || false);
        }
      } catch (e) {
        Alert.alert("Erreur", "Impossible de récupérer les résultats.");
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, [[user?.id]]);

  // Show loading indicator
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#047857" />
      </View>
    );
  }

  // Show "results not ready" screen if not ready
  if (!maleCompleted || !femaleCompleted) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 16 }}>
          Les résultats n'ont pas encore été générés. Les deux partenaires
          doivent compléter le quiz.
        </Text>
        <Pressable
          style={{
            backgroundColor: "#047857",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
          onPress={() => router.replace("/quiz")}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Retourner au quiz</Text>
        </Pressable>
      </View>
    );
  }

  // Risk evaluation logic (same as before, but based on fetched score)
  const isAtRisk = score >= 1;
  const riskLevel = isAtRisk ? "élevé" : "pas de risque élevé";
  const severity = isAtRisk ? "élevé" : "pas de risque élevé";
  const factorName = isAtRisk
    ? "⚠️ Attention : Risque élevé détecté"
    : "✅ Aucun risque élevé détecté";
  const description = isAtRisk
    ? "Veuillez consulter un médecin spécialiste de l’infertilté."
    : "Veuillez consulter les fiches conseils personnalisées afin d’améliorer votre fertilité spontanée. En cas d’absence de grossesse après 12 mois d’essai, veuillez consulter un médecin spécialiste de l’infertilté.";

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Résultats personnalisés</Text>
      {/* <ResultsCard
        result={{
          riskLevel,
          factors: [
            {
              name: factorName,
              severity: "pas de risque élevé",
              description,
            },
            {
              name: "other factors",
              severity,
              description,
            },
            {
              name: factorName + "XXX",
              severity: "élevé",
              description,
            },
          ],
          nextSteps: [
            isAtRisk
              ? "Discutez de vos résultats avec un professionnel de santé."
              : "Revérifiez dans 3 mois ou en cas de changement.",
          ],
        }}
        assessmentDate={new Date()}
        onScheduleReminder={() => Alert.alert("Rappel planifié appuyé")}
      /> */}

      <ResultsCard
        result={{
          riskLevel,
          description,
          factors: adviceFactors, // Use generated factors instead of hardcoded ones
          nextSteps: [
            isAtRisk
              ? "Discutez de vos résultats avec un professionnel de santé."
              : "Revérifiez dans 3 mois ou en cas de changement.",
          ],
        }}
        assessmentDate={new Date()}
        onScheduleReminder={() => Alert.alert("Rappel planifié appuyé")}
      />
      {/* <View style={styles.card}>
        <Text style={styles.summaryTitle}>Résumé de vos réponses</Text>
        <ResponseSummary responses={answers} questions={questions} />
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8fafc", flexGrow: 1 },
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
    marginTop: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#047857",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#064e3b",
    marginBottom: 10,
  },
});
