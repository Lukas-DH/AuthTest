import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Linking,
} from "react-native";
import { Link, router } from "expo-router";
import appJson from "@/app.json";
import { useState } from "react";
import { useSession } from "@/components/ctx";

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      {/* Username Field */}
      <Text style={styles.label}>Adresse e-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Entrez votre adresse e-mail"
        placeholderTextColor="#A4D65E"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Pressable>
        <Text style={styles.link}>Identifiant oublié ?</Text>
      </Pressable>

      {/* Password Field */}
      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Entrez votre mot de passe"
        placeholderTextColor="#A4D65E"
        secureTextEntry
      />
      <Pressable>
        <Text style={styles.link}>Mot de passe oublié ?</Text>
      </Pressable>

      {/* Connect Button */}
      <Pressable
        style={[
          styles.button,
          email && password ? styles.buttonEnabled : styles.buttonDisabled,
        ]}
        disabled={!email || !password}
        onPress={async () => {
          try {
            await signIn(email, password);
            router.push("/verify-phone");
          } catch (error: any) {
            console.error("Sign-in failed:", error?.message ?? error);
            alert(error?.message || "Échec de la connexion. Veuillez réessayer.");
          }
        }}
      >
        <Text style={styles.buttonText}>SE CONNECTER</Text>
      </Pressable>

      {/* Register & Alternative Login */}
      <Text style={styles.registerText}>
        Pas encore de compte ?{" "}
        <Link href="/register">
          <Text style={styles.registerLink}>S'inscrire</Text>
        </Link>
      </Text>
      {/* Footer */}
      <Text style={styles.footerText}>
        Besoin d'aide ?{" "}
        <Text style={styles.link} onPress={() => Linking.openURL("mailto:predictf@open-ivf.com")}>
          predictf@open-ivf.com
        </Text>
      </Text>
      <Text style={styles.terms}>
        <Text style={styles.link} onPress={() => Linking.openURL("https://sea-turtle-app-qfyrw.ondigitalocean.app/privacy")}>
          Conditions d'utilisation
        </Text>{" "}&{" "}
        <Text style={styles.link} onPress={() => Linking.openURL("https://sea-turtle-app-qfyrw.ondigitalocean.app/privacy")}>
          Politique de confidentialité
        </Text>
      </Text>
      <Text style={styles.version}>Version {appJson.expo.version}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004F71", // Dark blue background
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A4D65E", // Light green title
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#00AB8E", // Teal label color
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#0097A9", // Cyan border
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    color: "#004F71", // Dark blue text
    marginBottom: 10,
  },
  link: {
    fontSize: 14,
    color: "#A4D65E", // Light green links
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonEnabled: {
    backgroundColor: "#00AB8E", // Teal button when active
  },
  buttonDisabled: {
    backgroundColor: "#666", // Gray button when disabled
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    fontSize: 14,
    color: "#FFF", // White text
  },
  registerLink: {
    color: "#A4D65E",
    fontWeight: "bold",
  },
  or: {
    fontSize: 16,
    color: "#A4D65E",
    marginVertical: 10,
  },
  footerText: {
    fontSize: 12,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 5,
  },
  terms: {
    fontSize: 12,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 15,
  },
  version: {
    fontSize: 12,
    color: "#A4D65E",
  },
});
