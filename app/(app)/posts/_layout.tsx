import { Text, Pressable } from "react-native";
import { Redirect, Stack, Link } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useSession } from "@/components/ctx";

export default function AppLayout() {
  const { session, isLoading } = useSession();

  const { documentId } = useLocalSearchParams<{ documentId: string }>();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Chargement...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    // <StatusBar style="light">
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#25292e" },
        headerShadowVisible: false,
        headerShown: false,
        headerTintColor: "#fff",
        headerRight: () => (
          <Link href="/blog" asChild>
            <Pressable style={{ paddingHorizontal: 10 }}>
              <Text style={{ color: "#fff" }}>← Retour</Text>
            </Pressable>
          </Link>
        ),
      }}
    >
      {/* Document-specific screen */}
      <Stack.Screen
        name="[documentId]"
        options={{
          title: "Blog",
          headerTitleStyle: { color: "#fff" },
          headerShown: true,
        }}
      />
    </Stack>
  );
}
