import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSession } from "@/components/ctx";
import { useEffect, useState } from "react";

type UserProfile = {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
};

export default function Profile() {
  const { session, deleteAccount } = useSession();
  const [profile, setProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!session) return;
    const { jwt } = JSON.parse(session);
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
      .then((r) => r.json())
      .then((data) => setProfile(data))
      .catch(() => {
        // Fallback to session data if fetch fails
        const { user } = JSON.parse(session);
        setProfile(user);
      })
      .finally(() => setLoading(false));
  }, [session]);

  const handleDelete = () => {
    const message =
      "This will permanently delete your account and all your data. This action cannot be undone.";

    if (Platform.OS === "web") {
      if (!window.confirm(message)) return;
      setDeleting(true);
      deleteAccount()
        .catch((error: any) =>
          window.alert(error?.message || "Failed to delete account.")
        )
        .finally(() => setDeleting(false));
      return;
    }

    Alert.alert("Delete Account", message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setDeleting(true);
          try {
            await deleteAccount();
          } catch (error: any) {
            Alert.alert("Error", error?.message || "Failed to delete account.");
            setDeleting(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#A4D65E" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>My Profile</Text>

        <Text style={styles.label}>First Name</Text>
        <TextInput style={styles.input} value={profile.firstname || "—"} editable={false} />

        <Text style={styles.label}>Last Name</Text>
        <TextInput style={styles.input} value={profile.lastname || "—"} editable={false} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={profile.email || "—"} editable={false} />

        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={profile.phone || "—"} editable={false} />

        <Pressable
          style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004F71",
    paddingHorizontal: 20,
  },
  content: {
    paddingVertical: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A4D65E",
    marginBottom: 24,
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
    marginBottom: 16,
    opacity: 0.8,
  },
  deleteButton: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#C0392B",
    marginTop: 24,
  },
  deleteButtonDisabled: {
    backgroundColor: "#666",
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
