import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Chrome as Home, TriangleAlert as AlertTriangle } from "lucide-react-native";
import PSBColors from "../constants/colors";

export default function NotFoundScreen() {
  return (
    <LinearGradient colors={PSBColors.gradients.neutral} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <AlertTriangle size={80} color={PSBColors.error} />
          </View>
          <Text style={styles.title}>404</Text>
          <Text style={styles.subtitle}>Page Not Found</Text>
          <Text style={styles.description}>
            Sorry! The page you're looking for is not available.
          </Text>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push("/(app)/(tabs)")}
            activeOpacity={0.8}
          >
            <Home size={20} color={PSBColors.white} />
            <Text style={styles.homeButtonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    backgroundColor: PSBColors.gray[100],
    padding: 20,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 72,
    fontWeight: "bold",
    color: PSBColors.text.primary,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: PSBColors.error,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: PSBColors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PSBColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: PSBColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  homeButtonText: {
    color: PSBColors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
