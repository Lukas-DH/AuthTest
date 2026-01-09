import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function InfoScreen() {
  const router = useRouter();
  const [consentChecked, setConsentChecked] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Predict-F</Text>
        <Text style={styles.subtitle}>
          Dépistage précoce et prévention des risques d’infertilité
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>A propos de cette application </Text>
          <View style={styles.textGroup}>
            <Text style={styles.paragraph}>
              Cette application est destinée :
            </Text>
            <View style={styles.list}>
              <Text style={styles.paragraph}>
                à vous donner des conseils personnalisés pour améliorer votre
                fertilité spontanée et à suivre vos progrès dans la mise en
                application de certains conseils de prévention.
              </Text>
              <Text style={styles.paragraph}>
                à détecter des situations à très fort risque d’infertilité
                nécessitant une consultation médicale spécialisée.
              </Text>
            </View>
            <Text style={styles.paragraph}>
              Attention, l’absence de risque majeur identifié par l’application
              ne garantit pas l’obtention rapide d’une grossesse. De plus, cette
              application n’a pas été conçue pour estimer vos chances de
              grossesse et ne remplace pas une consultation médicale lorsque
              celle-ci peut s’avérer.
            </Text>
            {/* <Text style={styles.note}>
              Remarque : cette application ne remplace pas un avis médical.
              Consultez un professionnel en cas de doute.
            </Text> */}
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Pressable
              onPress={() => setConsentChecked(!consentChecked)}
              style={{
                height: 24,
                width: 24,
                borderWidth: 1,
                borderColor: "#64748b",
                marginRight: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: consentChecked ? "#059669" : "#fff",
              }}
            >
              {consentChecked && (
                <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>
              )}
            </Pressable>
            <Text style={{ fontSize: 12, color: "#475569" }}>
              J’ai lu et compris les limites de cette application.
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.buttonPrimary,
              pressed && styles.buttonPrimaryPressed,
              !consentChecked && { opacity: 0.5 },
            ]}
            onPress={() => router.push("/quiz")}
            disabled={!consentChecked}
          >
            <Text style={styles.buttonText}>Démarrer l’évaluation</Text>
          </Pressable>
        </View>

        <Text style={styles.consent}>
          En continuant, vous acceptez la collecte et l'analyse de vos données.
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
  textGroup: { gap: 0 },
  paragraph: {
    fontSize: 14,
    color: "#475569",
    marginTop: 10,
    lineHeight: 20,
  },
  list: { marginTop: 10, marginBottom: 10 },
  listItem: {
    marginTop: 10,
    lineHeight: 20,
    fontSize: 14,
    color: "#475569",
    marginLeft: 10,
  },
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
