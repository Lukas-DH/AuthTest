import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useSession } from "@/components/ctx";

function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return phone.slice(0, 4) + " **** " + phone.slice(-4);
}

export default function VerifyPhone() {
  const { verifyPhone, confirmSms, pendingPhone } = useSession();
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!pendingPhone) return;
    setLoading(true);
    try {
      await verifyPhone(pendingPhone);
      setCodeSent(true);
    } catch (error: any) {
      console.error("Send code error:", error);
      alert(error?.message || "Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!code) return;
    setLoading(true);
    try {
      await confirmSms(code);
    } catch (error: any) {
      console.error("Verify code error:", error);
      alert(error?.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Invisible reCAPTCHA mount point — required by Firebase on web */}
      {Platform.OS === "web" && <div id="recaptcha-container" />}

      <Text style={styles.title}>Phone Verification</Text>
      <Text style={styles.subtitle}>
        Send a one-time code to{" "}
        <Text style={styles.phone}>
          {pendingPhone ? maskPhone(pendingPhone) : "your registered number"}
        </Text>
      </Text>

      {!codeSent ? (
        <Pressable
          style={[styles.button, pendingPhone ? styles.buttonEnabled : styles.buttonDisabled]}
          disabled={!pendingPhone || loading}
          onPress={handleSendCode}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>SEND CODE</Text>
          )}
        </Pressable>
      ) : (
        <>
          <Text style={styles.label}>Verification code</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="123456"
            placeholderTextColor="#A4D65E"
            keyboardType="number-pad"
            maxLength={6}
          />

          <Pressable
            style={[
              styles.button,
              code.length === 6 ? styles.buttonEnabled : styles.buttonDisabled,
            ]}
            disabled={code.length !== 6 || loading}
            onPress={handleVerify}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>VERIFY</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              setCodeSent(false);
              setCode("");
            }}
          >
            <Text style={styles.link}>Resend code</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004F71",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A4D65E",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 24,
  },
  phone: {
    color: "#A4D65E",
    fontWeight: "bold",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#00AB8E",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#0097A9",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    color: "#004F71",
    marginBottom: 10,
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
    backgroundColor: "#00AB8E",
  },
  buttonDisabled: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    fontSize: 14,
    color: "#A4D65E",
    marginTop: 4,
  },
});
