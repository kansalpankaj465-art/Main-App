import { View, Text } from "react-native";
import ForgotPassword from "../../components/ForgotPassword";
import { router } from "expo-router";

export default function ForgotPasswordScreen() {
  return (
    <ForgotPassword
      onBackToLogin={() => {
        router.push("/login");
      }}
      onOtpVerified={() => {
        router.push("/reset-password");
      }}
    />
  );
}
