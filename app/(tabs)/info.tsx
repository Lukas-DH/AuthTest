import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function InfoScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Fertility Companion</Text>
        <Text style={styles.subtitle}>
          Early detection and risk assessment for fertility health
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About This Clinical Trial</Text>
          <View style={styles.textGroup}>
            <Text style={styles.paragraph}>
              Welcome to the Fertility Companion clinical trial. This
              application aims to:
            </Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>
                • Identify early signs of potential fertility issues
              </Text>
              <Text style={styles.listItem}>
                • Assess key risk factors that may affect fertility
              </Text>
              <Text style={styles.listItem}>
                • Provide personalized recommendations based on your responses
              </Text>
              <Text style={styles.listItem}>
                • Track progress over time with follow-up assessments
              </Text>
            </View>
            <Text style={styles.paragraph}>
              Your participation involves completing a comprehensive
              questionnaire about your health, lifestyle, and reproductive
              history. The assessment takes approximately 10–15 minutes.
            </Text>
            <Text style={styles.note}>
              Note: This application is part of a clinical trial and should not
              replace professional medical advice. Please consult with a
              healthcare provider for any concerns about your fertility.
            </Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <Pressable
            style={({ pressed }) => [
              styles.buttonPrimary,
              pressed && styles.buttonPrimaryPressed,
            ]}
            onPress={() => router.push("/")}
          >
            <Text style={styles.buttonText}>Start Assessment</Text>
          </Pressable>
        </View>

        <Text style={styles.consent}>
          By continuing, you agree to participate in this clinical trial and
          consent to the collection and analysis of your data for research
          purposes.
        </Text>
      </View>
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
