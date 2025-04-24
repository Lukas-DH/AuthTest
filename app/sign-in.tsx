import {
  Text,
  View,
  TextInput,
  Pressable,
  Switch,
  StyleSheet,
} from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useSession } from "@/components/ctx";

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      {/* Username Field */}
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        placeholderTextColor="#A4D65E"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Pressable>
        <Text style={styles.link}>Forgot your username?</Text>
      </Pressable>

      {/* Password Field */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        placeholderTextColor="#A4D65E"
        secureTextEntry
      />
      <Pressable>
        <Text style={styles.link}>Forgot your password?</Text>
      </Pressable>

      {/* Remember Me Toggle */}
      <View style={styles.rememberContainer}>
        <Switch
          value={rememberMe}
          onValueChange={setRememberMe}
          thumbColor={rememberMe ? "#00AB8E" : "#CCC"}
          trackColor={{ false: "#999", true: "#A4D65E" }}
        />
        <Text style={styles.rememberText}>Remember my username</Text>
      </View>

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
          } catch (error: any) {
            console.error("Sign-in failed:", error);
            alert(error?.message || "Failed to sign in. Please try again.");
          }
          // router.replace("/");
        }}
      >
        <Text style={styles.buttonText}>CONNECT</Text>
      </Pressable>

      {/* Register & Alternative Login */}
      <Text style={styles.registerText}>
        No account yet?{" "}
        <Link href="/register">
          <Text style={styles.registerLink}>Register</Text>
        </Link>
      </Text>
      <Text style={styles.or}>OR</Text>
      <Pressable>
        <Text style={styles.franceConnect}>Log in with France Connect</Text>
      </Pressable>

      {/* Footer */}
      <Text style={styles.footerText}>
        Need help? <Text style={styles.link}>Contact us</Text>
      </Text>
      <Text style={styles.terms}>
        <Text style={styles.link}>Terms of Use</Text> &{" "}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>
      <Text style={styles.version}>Version 3.5.3 (3050300)</Text>
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
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  rememberText: {
    fontSize: 16,
    color: "#FFF", // White text
    marginLeft: 8,
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
  franceConnect: {
    fontSize: 16,
    color: "#A4D65E",
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginBottom: 20,
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
