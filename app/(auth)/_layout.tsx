import { auth } from "@/lib/auth";
import { Redirect, Stack } from "expo-router";

export default function LoginScreen() {
  const { data: session } = auth.useSession();

  if (session) {
    console.log("User is authenticated, redirecting to dashboard...");
    return <Redirect href="/dashboard" />;
  }

  return (
    <Stack
      initialRouteName="welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="welcome" />
    </Stack>
  );
}
