import { View, Text } from "react-native";
import ResetPassword from "../../components/ResetPassword";
import { router } from "expo-router";

export default function ResetPasswordScreen() {
  return (
    <ResetPassword
      onBackToLogin={() => {
        router.push("/login");
      }}
    />
  );
}
