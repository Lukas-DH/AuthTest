import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

const Register: React.FC = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const cancelRegistration = () => {
    router.replace("/sign-in");
  };

  const registerUser = async () => {
    if (!firstName) return Alert.alert("Veuillez saisir votre prénom.");
    if (!lastName) return Alert.alert("Veuillez saisir votre nom.");
    if (!email) return Alert.alert("Veuillez saisir votre adresse e-mail.");
    if (!phone) return Alert.alert("Veuillez saisir votre numéro de téléphone.");
    if (!password) return Alert.alert("Veuillez saisir un mot de passe.");
    if (!passwordConfirm) return Alert.alert("Veuillez confirmer votre mot de passe.");
    if (password !== passwordConfirm) return Alert.alert("Les mots de passe ne correspondent pas.");

    // Basic E.164 check — Firebase requires this format for SMS.
    if (!/^\+\d{7,15}$/.test(phone)) {
      return Alert.alert(
        "Le numéro de téléphone doit être au format international, ex. +33612345678"
      );
    }

    setLoading(true);
    try {
      // Step 1: create the Strapi user account.
      const registerRes = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/local/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: email,
            email,
            password,
          }),
        }
      );

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        throw new Error(
          registerData?.error?.message ||
            registerData?.message ||
            "Registration failed."
        );
      }

      const { jwt, user } = registerData;

      // Step 2: save the phone number (and name) to the user profile.
      // Strapi's default register endpoint only accepts username/email/password,
      // so custom fields are updated immediately after with the returned JWT.
      const updateRes = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            phone,
            firstname: firstName,
            lastname: lastName,
          }),
        }
      );

      if (!updateRes.ok) {
        const updateData = await updateRes.json();
        throw new Error(
          updateData?.error?.message || "Failed to save profile details."
        );
      }

      Alert.alert("Account created!", "You can now sign in.", [
        { text: "OK", onPress: () => router.replace("/sign-in") },
      ]);
    } catch (error: any) {
      console.error("Registration error:", error?.message ?? error);
      Alert.alert("Registration failed", error?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.formView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Register</Text>

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setFirstName}
          value={firstName}
          placeholder="Enter first name"
          placeholderTextColor="#A4D65E"
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setLastName}
          value={lastName}
          placeholder="Enter last name"
          placeholderTextColor="#A4D65E"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Enter email"
          placeholderTextColor="#A4D65E"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Phone (e.g. +33612345678)</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPhone}
          value={phone}
          placeholder="+33612345678"
          placeholderTextColor="#A4D65E"
          keyboardType="phone-pad"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#A4D65E"
          secureTextEntry
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPasswordConfirm}
          value={passwordConfirm}
          placeholder="Confirm your password"
          placeholderTextColor="#A4D65E"
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading ? styles.buttonDisabled : styles.buttonEnabled]}
          onPress={registerUser}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>REGISTER ACCOUNT</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={cancelRegistration} disabled={loading}>
          <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004F71",
    paddingHorizontal: 20,
  },
  formView: {
    alignItems: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A4D65E",
    marginBottom: 20,
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
    marginTop: 10,
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
  cancelText: {
    fontSize: 14,
    color: "#A4D65E",
    marginTop: 4,
  },
});

export default Register;
