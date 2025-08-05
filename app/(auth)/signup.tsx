import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import SignupForm from "../../components/SignupForm";
import { router } from "expo-router";
import PSBColors from "../../constants/colors";

export default function SignupScreen() {
  const handleSignupSuccess = () => {
    router.push("/(auth)/otp-verification");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Ionicons name="business" size={48} color={PSBColors.primary} />
            <View style={styles.logoAccent} />
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>Punjab & Sind Bank</Text>
          <View style={styles.titleUnderline} />
        </View>
        <Text style={styles.appSubtitle}>Create Your Digital Banking Account</Text>
        <Text style={styles.appDescription}>Join millions of satisfied customers</Text>
        <View style={styles.trustBadge}>
          <Text style={styles.trustBadgeText}>🏆 India's Trusted Bank</Text>
        </View>
      </View>

      {/* Form Container */}
      <ScrollView style={styles.formContainer}>
        <SignupForm onSignupSuccess={handleSignupSuccess} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PSBColors.white,
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: PSBColors.primary,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: PSBColors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoAccent: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PSBColors.secondary,
    borderWidth: 2,
    borderColor: PSBColors.white,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: PSBColors.white,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: PSBColors.secondary,
    borderRadius: 2,
    marginTop: 8,
  },
  appSubtitle: {
    fontSize: 20,
    color: PSBColors.gray[200],
    fontWeight: "600",
    textAlign: "center",
  },
  appDescription: {
    fontSize: 16,
    color: PSBColors.gray[300],
    marginTop: 8,
    textAlign: "center",
    fontWeight: "500",
  },
  trustBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  trustBadgeText: {
    color: PSBColors.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: PSBColors.gray[50],
  },
});
