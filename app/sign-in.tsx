import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Linking,
  Modal,
} from "react-native";
import { Link, router } from "expo-router";
import appJson from "@/app.json";
import { useState, useEffect } from "react";
import { useSession } from "@/components/ctx";

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [supportEmail, setSupportEmail] = useState("predictf@open-ivf.com");
  const [supportInstruction, setSupportInstruction] = useState("");
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/supports`)
      .then((r) => r.json())
      .then((json) => {
        const first = json?.data?.[0];
        if (first?.email) setSupportEmail(first.email);
        if (first?.instruction) setSupportInstruction(first.instruction);
      })
      .catch(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <Modal
        visible={showSupport}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSupport(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowSupport(false)}>
          <Pressable style={styles.modalBox} onPress={() => {}}>
            <Text style={styles.modalTitle}>Besoin d'aide ?</Text>
            {supportInstruction ? (
              <Text style={styles.modalInstruction}>{supportInstruction}</Text>
            ) : null}
            <Text
              style={styles.modalEmail}
              onPress={() => Linking.openURL(`mailto:${supportEmail}`)}
            >
              {supportEmail}
            </Text>
            <Pressable style={styles.modalClose} onPress={() => setShowSupport(false)}>
              <Text style={styles.modalCloseText}>Fermer</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
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
      <Pressable onPress={() => setShowSupport(true)}>
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
      <Pressable onPress={() => setShowSupport(true)}>
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
        <Text style={styles.link} onPress={() => Linking.openURL(`mailto:${supportEmail}`)}>
          {supportEmail}
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#004F71",
    marginBottom: 12,
  },
  modalInstruction: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 14,
  },
  modalEmail: {
    fontSize: 15,
    color: "#00AB8E",
    fontWeight: "600",
    marginBottom: 20,
  },
  modalClose: {
    backgroundColor: "#004F71",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalCloseText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
