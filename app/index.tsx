import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";
import PSBColors from "../constants/colors";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: PSBColors.white,
          }}
        >
          <ActivityIndicator size="large" color={PSBColors.primary} />
        </View>
      </>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
