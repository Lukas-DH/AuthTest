import { Tabs, Redirect, useRouter } from "expo-router";
import { useSession } from "@/components/ctx";
import { useState } from "react";
import { Text, Pressable, View } from "react-native";
import { Ionicons, Foundation, MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const { session, isLoading, signOut } = useSession();
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return <Text style={styles.title}>Chargement...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: { backgroundColor: "#25292e" },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: { backgroundColor: "#25292e" },
        headerRight: () => (
          <View style={{ marginRight: 15 }}>
            {/* Burger Icon */}
            <Pressable onPress={() => setMenuVisible(!menuVisible)}>
              <Ionicons name="menu" size={30} color="#fff" />
            </Pressable>

            {/* Dropdown Menu */}
            {menuVisible && (
              <View style={styles.menu}>
                <Pressable
                  onPress={() => {
                    setMenuVisible(false);
                    router.push("/");
                  }}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuText}>Profile</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setMenuVisible(false);
                    signOut();
                  }}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuText}>Sign Out</Text>
                </Pressable>
              </View>
            )}
          </View>
        ),
      }}
    >
      {" "}
      <Tabs.Screen
        name="welcome"
        options={{
          headerTitle: "Accueil",
          tabBarLabel: "Accueil",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              size={30}
              color={color}
            />
          ),
          // 🏆 Burger Menu in Header
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          headerTitle: "quiz",
          tabBarLabel: "quiz",
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons
              name={focused ? "quiz" : "quiz"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          headerTitle: "Résultats",
          tabBarLabel: "Résultats",
          tabBarIcon: ({ focused, color }) => (
            <Foundation
              name={focused ? "results-demographics" : "results-demographics"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="blog"
        options={{
          headerTitle: "Blog",
          tabBarLabel: "blog",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = {
  menu: {
    position: "absolute" as "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#25292e",
    borderRadius: 8,
    paddingVertical: 10,
    width: 120,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  menuItem: {
    padding: 10,
    alignItems: "center" as const,
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold" as "bold",
    textAlign: "center" as "center",
    color: "#064e3b",
    marginBottom: 10,
  },
};
