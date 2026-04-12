import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

const boundedHeight = Dimensions.get("window").height;

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
    if (!firstName) return Alert.alert("Please enter your first name.");
    if (!lastName) return Alert.alert("Please enter your last name.");
    if (!email) return Alert.alert("Please enter an email.");
    if (!phone) return Alert.alert("Please enter your phone number.");
    if (!password) return Alert.alert("Please enter a password.");
    if (!passwordConfirm) return Alert.alert("Please confirm your password.");
    if (password !== passwordConfirm) return Alert.alert("Passwords do not match.");

    // Basic E.164 check — Firebase requires this format for SMS.
    if (!/^\+\d{7,15}$/.test(phone)) {
      return Alert.alert(
        "Phone number must be in international format, e.g. +33612345678"
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
      console.error("Registration error:", error);
      Alert.alert("Registration failed", error?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.formView}>
        <Text style={styles.formTitle}>REGISTER AN ACCOUNT</Text>

        <Text style={styles.formLabel}>First Name</Text>
        <TextInput
          style={styles.formInput}
          onChangeText={setFirstName}
          value={firstName}
          placeholder="Enter First Name"
        />

        <Text style={styles.formLabel}>Last Name</Text>
        <TextInput
          style={styles.formInput}
          onChangeText={setLastName}
          value={lastName}
          placeholder="Enter Last Name"
        />

        <Text style={styles.formLabel}>Email</Text>
        <TextInput
          style={styles.formInput}
          onChangeText={setEmail}
          value={email}
          placeholder="Enter Email"
          inputMode="email"
          autoCapitalize="none"
        />

        <Text style={styles.formLabel}>Phone (e.g. +33612345678)</Text>
        <TextInput
          style={styles.formInput}
          onChangeText={setPhone}
          value={phone}
          placeholder="+33612345678"
          keyboardType="phone-pad"
          autoCapitalize="none"
        />

        <Text style={styles.formLabel}>Password</Text>
        <TextInput
          style={styles.formInput}
          onChangeText={setPassword}
          value={password}
          placeholder="Enter Password"
          secureTextEntry
        />

        <Text style={styles.formLabel}>Confirm Password</Text>
        <TextInput
          style={styles.formInput}
          onChangeText={setPasswordConfirm}
          value={passwordConfirm}
          placeholder="Confirm your password"
          secureTextEntry
        />

        <TouchableOpacity onPress={registerUser} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#004F71" style={{ paddingTop: 20 }} />
          ) : (
            <Text style={styles.formButtonLabel}>REGISTER ACCOUNT</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={cancelRegistration} disabled={loading}>
          <Text style={styles.formButtonLabel}>CANCEL</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: boundedHeight,
    ...Platform.select({
      android: { paddingBottom: 360 },
      ios: { paddingBottom: 160 },
      default: { paddingBottom: 20 },
    }),
  },
  formView: {
    alignItems: "center",
  },
  formTitle: {
    fontFamily: "WorkSans-Regular",
    fontWeight: "700",
    ...Platform.select({
      android: { fontSize: 20, paddingVertical: 10 },
      ios: { fontSize: 20, paddingVertical: 10 },
      default: { fontSize: 30, paddingVertical: 20 },
    }),
  },
  formLabel: {
    fontFamily: "WorkSans-Regular",
    fontWeight: "500",
    ...Platform.select({
      android: { fontSize: 16, paddingTop: 10 },
      ios: { fontSize: 16, paddingTop: 10 },
      default: { fontSize: 24, paddingTop: 18 },
    }),
  },
  formInput: {
    fontFamily: "WorkSans-Regular",
    width: 250,
    borderWidth: 1,
    padding: 10,
    ...Platform.select({
      android: { fontSize: 16 },
      ios: { fontSize: 16 },
      default: { fontSize: 24, width: 400 },
    }),
  },
  formButtonLabel: {
    fontFamily: "WorkSans-Regular",
    fontWeight: "500",
    ...Platform.select({
      android: { fontSize: 16, paddingTop: 12 },
      ios: { fontSize: 16, paddingTop: 12 },
      default: { fontSize: 24, paddingTop: 20 },
    }),
  },
});

export default Register;
