import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { View, Text, ActivityIndicator } from "react-native";
import PSBColors from "../../constants/colors";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: PSBColors.white,
        }}
      >
        <ActivityIndicator size="large" color={PSBColors.primary} />
        <Text style={{ color: PSBColors.text.primary, marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Render the protected app
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      {/* <Stack.Screen name="pages" /> */}
    </Stack>
  );
}
