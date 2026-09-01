import React, { useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
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
  const [fetchError, setFetchError] = useState(false);
  type FactorItem = {
    documentId: string;
    name: string;
    description: string;
    pdfUrl: string | null;
  };
  const [adviceFactors, setAdviceFactors] = useState<{
    general: FactorItem[];
    female: FactorItem[];
    male: FactorItem[];
  }>({ general: [], female: [], male: [] });

  const { session, isLoading } = useSession();
  const router = useRouter();
  const { user, jwt } = session
    ? JSON.parse(session)
    : { user: null, jwt: null };

  const questions = [
    { id: "F.1", label: "Quel est votre âge ?" },
    {
      id: "F.9",
      label: "Avez-vous déjà subi une chirurgie au niveau du bas-ventre ?",
    },
    { id: "F.16.1", label: "Lesquelles ? :" },
  ];

  const fetchLatest = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setFetchError(false);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/users/me?populate=xresponses`,
        { headers: { Authorization: `Bearer ${jwt}` } },
      );
      const json = await response.json();
      const xresponses = (json.xresponses || []).sort(
        (a: any, b: any) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

      if (xresponses.length > 0) {
        const latest = xresponses[0];
        const male = latest.answerMale || {};
        const female = latest.answerFemale || {};
        setAnswers({ male, female });

        const combinedAnswers = { ...male, ...female };
        const postTitles = generateAdviceFactors(combinedAnswers);

        const postsResponse = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/posts?populate=image`,
        );
        const postsJson = await postsResponse.json();

        const mapPost = (post: any): FactorItem => ({
          documentId: post.documentId,
          name: post.title,
          description: post.summary,
          pdfUrl: post.image?.url || null,
        });

        const filtered = postsJson.data.filter((post: any) =>
          postTitles.includes(post.title),
        );

        setAdviceFactors({
          general: filtered
            .filter((p: any) => p.content === "Pour tout le monde")
            .map(mapPost),
          female: filtered
            .filter((p: any) => p.content === "female")
            .map(mapPost),
          male: filtered.filter((p: any) => p.content === "male").map(mapPost),
        });

        const maleScore = male.score ? parseInt(male.score, 10) : 0;
        const femaleScore = female.score ? parseInt(female.score, 10) : 0;
        setScore(maleScore + femaleScore);

        setMaleCompleted(latest.maleCompleted || false);
        setFemaleCompleted(latest.femaleCompleted || false);
      }
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [user?.id, jwt]);

  useFocusEffect(
    useCallback(() => {
      if (isLoading || !user?.id) return;
      fetchLatest();
    }, [fetchLatest, isLoading]),
  );

  if (loading || isLoading || !user) {
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

  if (fetchError) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.messageText}>
          Impossible de charger les résultats. Vérifiez votre connexion
          internet.
        </Text>
        <Pressable style={styles.actionButton} onPress={fetchLatest}>
          <Text style={styles.actionButtonText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  if (!maleCompleted || !femaleCompleted) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.messageText}>
          Les résultats n'ont pas encore été générés. Les deux partenaires
          doivent compléter le quiz.
        </Text>
        <Pressable
          style={styles.actionButton}
          onPress={() => router.replace("/quiz")}
        >
          <Text style={styles.actionButtonText}>Retourner au quiz</Text>
        </Pressable>
      </View>
    );
  }

  const isAtRisk = score >= 1;
  const riskLevel = isAtRisk ? "élevé" : "pas de risque élevé";
  const description = isAtRisk
    ? "Veuillez consulter un médecin spécialiste de l'infertilté."
    : "Veuillez consulter les fiches conseils personnalisées afin d'améliorer votre fertilité spontanée. En cas d'absence de grossesse après 12 mois d'essai, veuillez consulter un médecin spécialiste de l'infertilté.";

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Résultats personnalisés</Text>
      <ResultsCard
        result={{
          riskLevel,
          description,
          factors: adviceFactors,
          nextSteps: [
            isAtRisk
              ? "Discutez de vos résultats avec un professionnel de santé."
              : "Revérifiez dans 3 mois ou en cas de changement.",
          ],
        }}
        assessmentDate={new Date()}
        onScheduleReminder={() => Alert.alert("Rappel planifié appuyé")}
      />
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
  messageText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: "#475569",
    lineHeight: 24,
  },
  actionButton: {
    backgroundColor: "#047857",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
