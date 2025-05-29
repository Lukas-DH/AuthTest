import React from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { ResultsCard } from "@/components/resultsCard";

export default function ResultsScreen() {
  // Get points from route params (default to 0 if not present)
  const { points } = useLocalSearchParams();
  // const score = Number(points) || 2;
  const score = 1;

  const isAtRisk = score >= 0;
  const riskLevel = isAtRisk ? "élevé" : "pas de risque élevé";
  const severity = isAtRisk ? "élevé" : "pas de risque élevé";
  const factorName = isAtRisk
    ? "⚠️ Attention : Risque élevé détecté"
    : "✅ Aucun risque élevé détecté";
  const description = isAtRisk
    ? "Vos réponses indiquent un ou plusieurs facteurs de risque. Il est conseillé de consulter un médecin pour un avis personnalisé."
    : "Aucun facteur de risque élevé détecté selon vos réponses. Continuez à adopter de bonnes habitudes !";

  return (
    <ScrollView style={styles.container}>
      <ResultsCard
        result={{
          riskLevel,
          factors: [
            {
              name: factorName,
              severity,
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
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8fafc", flexGrow: 1 },
});
