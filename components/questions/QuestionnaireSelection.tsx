import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

interface QuestionnaireSelectionProps {
  onSelectQuestionnaire: (type: "male" | "female") => void;
  onViewResults: () => void;
  maleCompleted: boolean;
  femaleCompleted: boolean;
  onNext?: (event: GestureResponderEvent) => void;
  onRestart?: () => void;
}

export default function QuestionnaireSelection({
  onSelectQuestionnaire,
  onViewResults,
  maleCompleted,
  femaleCompleted,
  onNext,
  onRestart,
}: QuestionnaireSelectionProps) {
  const bothCompleted = maleCompleted && femaleCompleted;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenue</Text>
        <Text style={styles.description}>
          Répondez à quelques questions pour recevoir des conseils
          personnalisés.
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>
          L’évaluation vous prendra environ 10 à 15 minutes et inclut des
          questions sur :{/* {"\n\n"}• Sur votre santé en général */}
          {"\n"}• Vos modes de vie.
          {"\n"}• Vos expositions aux toxiques environnementaux.
          {"\n"}
        </Text>
      </View>

      {/* Male Questionnaire Card */}
      <Pressable
        onPress={() => onSelectQuestionnaire("male")}
        disabled={maleCompleted}
        style={[
          styles.cardItem,
          maleCompleted && { borderColor: "#059669", borderWidth: 2 },
        ]}
      >
        <View style={styles.row}>
          <Feather
            name={maleCompleted ? "check-circle" : "circle"}
            size={24}
            color={maleCompleted ? "#059669" : "#e2e8f0"}
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>
              Questionnaire{" "}
              <Text
                style={[
                  styles.badge,
                  { backgroundColor: "#EAF2FB", color: "#065f46" },
                ]}
              >
                Monsieur
              </Text>{" "}
            </Text>
            <Text
              style={[
                styles.cardStatus,
                maleCompleted && { color: "#059669", fontWeight: "bold" },
              ]}
            >
              {maleCompleted ? "Terminé" : "Non commencé"}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={maleCompleted ? "#059669" : "#94a3b8"}
            style={{ marginLeft: 8 }}
          />
        </View>
      </Pressable>

      {/* Female Questionnaire Card */}
      <Pressable
        onPress={() => onSelectQuestionnaire("female")}
        disabled={femaleCompleted}
        style={[
          styles.cardItem,
          femaleCompleted && { borderColor: "#059669", borderWidth: 2 },
        ]}
      >
        <View style={styles.row}>
          <Feather
            name={femaleCompleted ? "check-circle" : "circle"}
            size={24}
            color={femaleCompleted ? "#059669" : "#e2e8f0"}
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>
              Questionnaire{" "}
              <Text
                style={[
                  styles.badge,
                  { backgroundColor: "#F3E3F9", color: "#065f46" },
                ]}
              >
                Madame
              </Text>{" "}
            </Text>
            <Text
              style={[
                styles.cardStatus,
                femaleCompleted && { color: "#059669", fontWeight: "bold" },
              ]}
            >
              {femaleCompleted ? "Terminé" : "Non commencé"}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={femaleCompleted ? "#059669" : "#94a3b8"}
            style={{ marginLeft: 8 }}
          />
        </View>
      </Pressable>

      {/* Show view results button if both completed */}
      {bothCompleted && (
        <View style={styles.resultsCard}>
          <View style={styles.resultsRow}>
            <Feather
              name="check-circle"
              size={24}
              color="#059669"
              style={{ marginRight: 12 }}
            />
            <Text style={styles.resultsTitle}>
              Les deux questionnaires sont terminés !
            </Text>
          </View>
          <Text style={styles.resultsSubtitle}>
            Vous pouvez maintenant voir votre évaluation personnalisée de
            fertilité.
          </Text>
          <Pressable style={styles.resultsButton} onPress={onViewResults}>
            <Text style={styles.resultsButtonText}>Voir les résultats</Text>
          </Pressable>
        </View>
      )}
      {onRestart && (
        // <View style={styles.footer}>
        <Pressable
          onPress={onRestart}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Recommencer le questionnaire</Text>
          <Feather
            name="refresh-ccw"
            size={16}
            color="#FFF"
            style={styles.icon}
          />
        </Pressable>
        // </View>
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
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20, // Match onboardingCard
    fontWeight: "600",
    color: "#047857",
    textAlign: "left",
  },
  description: {
    fontSize: 14, // Match onboardingCard
    color: "#475569",
    marginTop: 4,
    textAlign: "left",
    lineHeight: 20,
  },
  content: {
    marginVertical: 10,
  },
  // bullets: {
  //   fontSize: 14, // Match extraInfo in onboardingCard
  //   color: "#475569",
  //   lineHeight: 20,
  //   marginBottom: 10,
  // },
  button: {
    backgroundColor: "#059669",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  buttonPressed: {
    backgroundColor: "#047857",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cardItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: "#064e3b",
    marginBottom: 2,
  },
  cardStatus: {
    fontSize: 14,
    color: "#475569",
  },
  resultsCard: {
    backgroundColor: "#F0FDF4",
    borderColor: "#A7F3D0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    alignItems: "center",
  },
  resultsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  resultsTitle: {
    fontWeight: "bold",
    color: "#059669",
    fontSize: 17,
    marginLeft: 6,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: "#059669",
    marginBottom: 14,
    textAlign: "center",
  },
  resultsButton: {
    backgroundColor: "#059669",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  resultsButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
