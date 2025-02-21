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
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const boundedHeight = Dimensions.get("window").height;

const Register: React.FC = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const cancelRegistration = (): void => {
    router.replace("/");
  };

  const registerUser = async (): Promise<void> => {
    if (!email) {
      Alert.alert("Please enter an email!");
    } else if (!firstName) {
      Alert.alert("Please enter your first name!");
    } else if (!lastName) {
      Alert.alert("Please enter your last name!");
    } else if (!password) {
      Alert.alert("Please enter a password!");
    } else if (!passwordConfirm) {
      Alert.alert("Please confirm your password!");
    } else if (password !== passwordConfirm) {
      Alert.alert("Passwords do not match!");
    } else {
      try {
        const existingUser = await SecureStore.getItemAsync(email);
        if (existingUser !== null) {
          Alert.alert(`${email} user already exists`);
        } else {
          const USER = {
            fname: firstName,
            lname: lastName,
            passwrd: password,
          };
          await SecureStore.setItemAsync(email, JSON.stringify(USER));
          Alert.alert(`Account created for ${email}`);
          router.replace("/");
        }
      } catch (error) {
        console.error("Error accessing SecureStore:", error);
      }
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
        />
        <Text style={styles.formLabel}>Password</Text>
        <TextInput
          style={styles.formInput}
          onChangeText={setPassword}
          value={password}
          placeholder="Enter Password"
          secureTextEntry={true}
        />
        <Text style={styles.formLabel}>Confirm Password</Text>
        <TextInput
          style={styles.formInput}
          onChangeText={setPasswordConfirm}
          value={passwordConfirm}
          placeholder="Confirm your password"
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={registerUser}>
          <Text style={styles.formButtonLabel}>REGISTER ACCOUNT</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={cancelRegistration}>
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
