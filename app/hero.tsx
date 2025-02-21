import Button from "@/components/Button";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004F71" />

      <View style={styles.mainContent}>
        <Ionicons name="calculator" size={70} color="black" />
        {/* Hero Section */}
        <Text style={styles.title}>Empower Your Fertility Journey</Text>
        <Text style={styles.subtitle}>
          Discover insights backed by an 80-page bibliographic study provided by
          our gynocologists and reproductive experts, designed to guide you
          through fertility planning. Included, a self-assessment questionnaire
          for both men and women, providing Personalized advice sheets and a
          binary classification indicating whether the risk of infertility.
        </Text>

        <Button
          theme="primary"
          label="Register to Get Started"
          onPress={() => router.push("/")} // Navigate to /q2
        />
      </View>

      {/* Secure Connection Prompt */}
      <Link href="/sign-in" style={""}>
        Sign-in
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#004F71",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#A4D65E",
    textAlign: "justify",
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: "#00AB8E",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#0097A9",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  franceConnectButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  franceConnectLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  franceConnectText: {
    fontSize: 16,
    color: "#004F71",
    fontWeight: "bold",
  },

  // Onboarding Styles
  onboardingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#FFF",
  },
  onboardingTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004F71",
    marginBottom: 10,
    textAlign: "center",
  },
  onboardingText: {
    fontSize: 16,
    color: "#0097A9",
    textAlign: "center",
    marginBottom: 30,
  },
  onboardingButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
