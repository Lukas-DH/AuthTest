import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

// Define the AssessmentResult interface
interface AssessmentResult {
  riskLevel: "pas de risque élevé" | "élevé";
  description?: string; // Optional description for the result
  factors: {
    documentId: string;
    name: string;
    description: string;
    pdfUrl?: string | null;
  }[];
  // advice: string[];
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
  const getBadgeStyle = (level: "pas de risque élevé" | "élevé") => {
    switch (level) {
      case "pas de risque élevé":
        return [styles.riskBadge, { backgroundColor: "#d1fae5", color: "#065f46" }];

      case "élevé":
        return [styles.riskBadge, { backgroundColor: "#fee2e2", color: "#991b1b" }];
      default:
        return styles.riskBadge;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Résultat PREDICT-F pour la détection d’un risque élevé d’infertilité
        </Text>
        <Text style={getBadgeStyle(result.riskLevel)}>
          {result.riskLevel == "élevé"
            ? "risque élevé detecté"
            : "pas de risque élevé détecté"}
        </Text>
        {/* <Text style={getBadgeStyle(result.riskLevel)}>{result.riskLevel}</Text> */}
        <Text style={styles.description}>
          {result.description}
          {/* Veuillez consulter les fiches conseils personnalisées afin d’améliorer
          votre fertilité spontanée. En cas d’absence de grossesse après au
          moins 12 mois d’essai, veuillez consulter un médecin spécialiste de
          l’infertilité au CHU de Toulouse 05 67 77 11 02 */}
          {/* {assessmentDate.toDateString()} */}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {/* <Ionicons name="warning" size={18} color="orange" /> */}
          📋 Conseils personnalisés
        </Text>
        <Text style={styles.factorDescription}>
          Cliquez ci-dessous pour en savoir plus👇
        </Text>
        {result.factors.map((factor, idx) => (
          <Pressable
            key={factor.documentId}
            style={({ pressed }) => [
              styles.factor,
              pressed && styles.factorPressed,
            ]}
            onPress={async () => {
              if (factor.pdfUrl) {
                try {
                  await WebBrowser.openBrowserAsync(factor.pdfUrl);
                } catch (error) {
                  console.error("Error opening PDF:", error);
                }
              }
            }}
            disabled={!factor.pdfUrl}
          >
            <View style={styles.factorHeader}>
              <Text style={styles.factorName}>{factor.name}</Text>
              {factor.pdfUrl && (
                <Ionicons name="document-text" size={20} color="#047857" />
              )}
            </View>
            <Text style={styles.factorDescription}>{factor.description}</Text>
            {factor.pdfUrl && (
              <Text style={styles.tapHint}>Appuyez pour ouvrir le PDF</Text>
            )}
          </Pressable>
        ))}
      </View>

      <View style={styles.referenceBox}>
        <Text style={styles.referenceText}>
          Les algorithmes de dépistage et de prévention de l'application ont été développés sous la supervision du Pr Nicolas Gatimel du CHU de Toulouse, France. Ils sont fondés sur une revue structurée de la littérature scientifique selon une méthodologie validée, suivie d'un consensus d'experts au sein d'une équipe multidisciplinaire (gynécologues, andrologues et biologistes de la reproduction). Toutes les recommandations et évaluations du risque mises en œuvre dans l'application découlent de ce processus fondé sur les preuves, garantissant transparence, fiabilité et pertinence clinique.
        </Text>
      </View>
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
    // color: "#475569",
    color: "green",
    // make bold
    fontWeight: "600",
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
  riskBadge: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
    overflow: "hidden",
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    backgroundColor: "#fff",
  },
  factorPressed: {
    backgroundColor: "#f0fdf4",
    borderColor: "#047857",
  },
  factorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  factorName: { fontWeight: "600", color: "#047857", flex: 1 },
  factorDescription: { fontSize: 14, color: "#475569", marginBottom: 4 },
  tapHint: {
    fontSize: 12,
    color: "#047857",
    fontStyle: "italic",
    marginTop: 4,
  },
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
  referenceBox: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  referenceText: {
    fontSize: 11,
    color: "#94a3b8",
    fontStyle: "italic",
    lineHeight: 16,
  },
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
  downloadButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  downloadButtonPressed: {
    backgroundColor: "#2563eb",
  },
});
