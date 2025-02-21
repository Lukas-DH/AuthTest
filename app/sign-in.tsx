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
      <Text style={styles.title}>Connection</Text>

      {/* Username Field */}
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.link}>Forgot your username?</Text>

      {/* Password Field */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      <Text style={styles.link}>Password forgotten?</Text>

      {/* Remember Me Toggle */}
      <View style={styles.rememberContainer}>
        <Switch
          value={rememberMe}
          onValueChange={setRememberMe}
          thumbColor="#00A99D"
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
        onPress={() => {
          signIn();
          router.replace("/");
        }}
      >
        <Text style={styles.buttonText}>CONNECT</Text>
      </Pressable>

      {/* Register & France Connect */}
      <Text style={styles.registerText}>
        No account yet?{" "}
        <Link href="/register">
          <Text style={styles.registerLink}>Register</Text>
        </Link>
      </Text>
      <Text style={styles.or}>OR</Text>
      <Text style={styles.franceConnect}>Log in with France Connect</Text>

      {/* Footer */}
      <Text style={styles.footerText}>
        Do you have a problem or a question?{" "}
        <Text style={styles.link}>Contact us</Text>
      </Text>
      <Text style={styles.terms}>
        <Text style={styles.link}>Terms of Use</Text> and{" "}
        <Text style={styles.link}>Privacy policy</Text>
      </Text>
      <Text style={styles.version}>Version 3.5.3 (3050300)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  link: {
    fontSize: 14,
    color: "#00A99D",
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
    marginLeft: 8,
  },
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonEnabled: {
    backgroundColor: "#00A99D",
  },
  buttonDisabled: {
    backgroundColor: "#CCC",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    fontSize: 14,
    color: "#666",
  },
  registerLink: {
    color: "#00A99D",
    fontWeight: "bold",
  },
  or: {
    fontSize: 16,
    color: "#999",
    marginVertical: 10,
  },
  franceConnect: {
    fontSize: 16,
    color: "#00A99D",
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  terms: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
  },
  version: {
    fontSize: 12,
    color: "#AAA",
  },
});
