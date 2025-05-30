import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useSession } from "@/components/ctx";

export default function AppLayout() {
  const { session, isLoading } = useSession();

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
      }}
    ></Stack>
    // </StatusBar>
  );
}
