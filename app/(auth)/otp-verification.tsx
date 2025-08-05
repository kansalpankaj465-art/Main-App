import { View, Text } from "react-native";
import OTPVerification from "../../components/OTPVerification";
import { router } from "expo-router";

export default function OtpVerificationScreen() {
  return (
    <OTPVerification
      onBackToSignup={() => {
        router.push("/signup");
      }}
      onVerificationComplete={() => {
        router.push("/(app)/(tabs)");
      }}
    />
  );
}
