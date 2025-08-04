import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import LoginForm from "../../components/LoginForm";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";
import ChatbotButton from "../../components/ChatbotButton";
import ChatbotPopup from "../../components/ChatbotPopup";
import PSBColors from "../../constants/colors";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleLoginSuccess = () => {
    signIn();
    // Navigation will be handled by AuthProvider
  };

  const switchToSignup = () => {
    router.push("/(auth)/signup");
  };

  const switchToForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="business" size={48} color={PSBColors.primary} />
        </View>
        <Text style={styles.appTitle}>Punjab & Sind Bank</Text>
        <Text style={styles.appSubtitle}>Secure Digital Banking</Text>
        <Text style={styles.appDescription}>Your Trusted Banking Partner Since 1908</Text>
      </View>

      {/* Form Container */}
      <View style={styles.formContainer}>
        <LoginForm
          onSwitchToSignup={switchToSignup}
          onForgotPassword={switchToForgotPassword}
          onLoginSuccess={handleLoginSuccess}
        />
      </View>
      {/* Floating Chatbot Button */}
      <ChatbotButton onPress={() => setPopupVisible(true)} />

      {/* Popup */}
      <ChatbotPopup
        visible={isPopupVisible}
        onClose={() => setPopupVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PSBColors.gray[50],
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: PSBColors.white,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PSBColors.gray[100],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: PSBColors.primary,
    marginTop: 10,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 18,
    color: PSBColors.text.secondary,
    marginTop: 5,
    fontWeight: "600",
  },
  appDescription: {
    fontSize: 14,
    color: PSBColors.text.secondary,
    marginTop: 8,
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
