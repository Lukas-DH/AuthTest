import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

interface FactorItem {
  documentId: string;
  name: string;
  description: string;
  pdfUrl?: string | null;
}

interface AssessmentResult {
  riskLevel: "pas de risque élevé" | "élevé";
  description?: string;
  factors: {
    general: FactorItem[];
    female: FactorItem[];
    male: FactorItem[];
  };
  nextSteps: string[];
}

interface ResultsCardProps {
  result: AssessmentResult;
  assessmentDate: Date;
  nextAssessmentDate?: Date;
  onScheduleReminder: () => void;
}

function FactorCard({ factor }: { factor: FactorItem }) {
  return (
    <Pressable
      key={factor.documentId}
      style={({ pressed }) => [styles.factor, pressed && styles.factorPressed]}
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
  );
}

function AdviceSection({
  label,
  badgeStyle,
  items,
}: {
  label: string;
  badgeStyle?: object;
  items: FactorItem[];
}) {
  return (
    <View style={styles.adviceSection}>
      <View style={styles.sectionLabelRow}>
        {badgeStyle ? (
          <Text style={[styles.audienceBadge, badgeStyle]}>{label}</Text>
        ) : (
          <Text style={styles.sectionTitle}>{label}</Text>
        )}
      </View>
      {items.length === 0 ? (
        <View style={styles.naCard}>
          <Text style={styles.naText}>Aucun conseil spécifique</Text>
        </View>
      ) : (
        items.map((factor) => (
          <FactorCard key={factor.documentId} factor={factor} />
        ))
      )}
    </View>
  );
}

export function ResultsCard({
  result,
  assessmentDate,
  onScheduleReminder,
}: ResultsCardProps) {
  const getBadgeStyle = (level: "pas de risque élevé" | "élevé") => {
    switch (level) {
      case "pas de risque élevé":
        return [
          styles.riskBadge,
          { backgroundColor: "#d1fae5", color: "#065f46" },
        ];
      case "élevé":
        return [
          styles.riskBadge,
          { backgroundColor: "#fee2e2", color: "#991b1b" },
        ];
      default:
        return styles.riskBadge;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Résultat PREDICT-F pour la détection d'un risque élevé d'infertilité
        </Text>
        <Text style={getBadgeStyle(result.riskLevel)}>
          {result.riskLevel === "élevé"
            ? "risque élevé detecté"
            : "pas de risque élevé détecté"}
        </Text>
        <Text style={styles.description}>{result.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Conseils personnalisés</Text>
        <Text style={styles.factorDescription}>
          Cliquez ci-dessous pour en savoir plus👇
        </Text>

        {result.riskLevel === "élevé" ? (
          <View style={styles.highRiskBox}>
            <Text style={styles.highRiskIcon}>⚠️</Text>
            <Text style={styles.highRiskMessage}>
              Un risque d’infertilité a été détecté par l’application. Ainsi
              nous vous conseillons de prendre rendez-vous auprès du service de
              Médecine de la Reproduction du CHU de Toulouse au 0567771102 en
              précisant « application Predict F » afin d’effectuer un diagnostic
              auprès d’un professionnel.
            </Text>
          </View>
        ) : (
          <>
            <AdviceSection
              label="Pour tout le monde"
              badgeStyle={{ backgroundColor: "#FFF9C4", color: "#065f46" }}
              items={result.factors.general}
            />
            <AdviceSection
              label="Madame"
              badgeStyle={{ backgroundColor: "#F3E3F9", color: "#065f46" }}
              items={result.factors.female}
            />
            <AdviceSection
              label="Monsieur"
              badgeStyle={{ backgroundColor: "#EAF2FB", color: "#065f46" }}
              items={result.factors.male}
            />
          </>
        )}
      </View>

      <View style={styles.referenceBox}>
        <Text style={styles.referenceText}>
          Les algorithmes de dépistage et de prévention de l'application ont été
          développés sous la supervision du Pr Nicolas Gatimel du CHU de
          Toulouse, France. Ils sont fondés sur une revue structurée de la
          littérature scientifique selon une méthodologie validée, suivie d'un
          consensus d'experts au sein d'une équipe multidisciplinaire
          (gynécologues, andrologues et biologistes de la reproduction). Toutes
          les recommandations et évaluations du risque mises en œuvre dans
          l'application découlent de ce processus fondé sur les preuves,
          garantissant transparence, fiabilité et pertinence clinique.
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
    color: "green",
    fontWeight: "600",
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
  adviceSection: {
    marginTop: 14,
  },
  sectionLabelRow: {
    marginBottom: 8,
  },
  audienceBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "600",
    overflow: "hidden",
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
  naCard: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f8fafc",
  },
  naText: {
    fontSize: 14,
    color: "#94a3b8",
    fontStyle: "italic",
  },
  highRiskBox: {
    backgroundColor: "#fff",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
  },
  highRiskIcon: {
    fontSize: 28,
    marginBottom: 10,
    textAlign: "center",
  },
  highRiskMessage: {
    fontSize: 14,
    color: "#111827",
    lineHeight: 22,
    textAlign: "left",
  },
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
});
