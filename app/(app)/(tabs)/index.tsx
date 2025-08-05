import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Brain,
  Flag,
  BookOpen,
  GraduationCap,
  Eye,
  Shield,
  TrendingUp,
  Target,
} from "lucide-react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { PSBColors, PSBShadows, PSBSpacing } from "../../../utils/PSBColors";
import ThemeToggle from "../../../components/ThemeToggle";
import ChatbotButton from "../../../components/ChatbotButton";
import ChatbotPopup from "../../../components/ChatbotPopup";

const { width } = Dimensions.get("window");

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const HomeScreen = () => {
  const { theme } = useTheme();
  const [isPopupVisible, setPopupVisible] = useState(false);

  const features = [
    { id: 1, title: "Simulators", description: "Understand fraud schemes through live simulations", icon: Brain, color: PSBColors.primary.green, route: "/(tabs)/simulator" },
    { id: 2, title: "Quizzes", description: "Test your financial fraud awareness skills", icon: Flag, color: PSBColors.primary.gold, route: "/pages/QuizzesScreen" },
    { id: 3, title: "Story Mode", description: "Learn through real-world case studies", icon: BookOpen, color: PSBColors.primary.green, route: "/pages/story" },
    { id: 4, title: "Decision Scenarios", description: "Practice secure financial decision making", icon: Target, color: PSBColors.primary.gold, route: "/pages/ScenarioHub" },
    { id: 5, title: "Education Center", description: "Trusted resources for fraud prevention", icon: GraduationCap, color: PSBColors.primary.green, route: "/(app)/(tabs)/education" },
  ];

  const stats = [
    { label: "Schemes Exposed", value: "50+", icon: Eye },
    { label: "Users Protected", value: "10K+", icon: Shield },
    { label: "Success Rate", value: "95%", icon: TrendingUp },
  ];

  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient colors={[PSBColors.background.primary, PSBColors.background.secondary]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.greetingWrapper}>
              <Text style={styles.greeting}>Welcome to PSB Fraud Shield</Text>
              <Text style={styles.subtitle}>Empowering safe and secure banking</Text>
            </View>
            <View style={styles.toggleWrapper}>
              <ThemeToggle />
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Our Impact</Text>
            <View style={styles.statsRow}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <stat.icon size={26} color={PSBColors.primary.green} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Explore Services</Text>
            <View style={styles.featuresGrid}>
              {features.map((feature) => (
                <AnimatedTouchable
                  key={feature.id}
                  style={[styles.featureCard, { transform: [{ scale: scaleAnim }] }]}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => router.push(feature.route as any)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={["#FFFFFF", "#FFF8E1"]}
                    style={[styles.featureGradient, { borderColor: feature.color }]}
                  >
                    <feature.icon size={32} color={feature.color} />
                    <Text style={[styles.featureTitle]}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </LinearGradient>
                </AnimatedTouchable>
              ))}
            </View>
          </View>

          {/* Quick Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.sectionTitle}>Banking Tip</Text>
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>💡</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Secure Transactions</Text>
                <Text style={styles.tipText}>
                  Always verify the sender’s details and avoid sharing OTP or account information over calls or messages.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Floating Chatbot Button */}
        <ChatbotButton onPress={() => setPopupVisible(true)} />

        {/* Popup */}
        <ChatbotPopup visible={isPopupVisible} onClose={() => setPopupVisible(false)} />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 80 },
  
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: PSBSpacing.lg,
    paddingTop: 30,
    paddingBottom: 25,
    backgroundColor: PSBColors.primary.green,
    borderBottomWidth: 3,
    borderBottomColor: PSBColors.primary.gold,
  },
  greetingWrapper: { flex: 1, paddingRight: 10 },
  greeting: { fontSize: 24, fontWeight: "bold", color: PSBColors.primary.gold },
  subtitle: { fontSize: 14, color: "#FFFFFF", marginTop: 4 },
  toggleWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  statsContainer: { paddingHorizontal: PSBSpacing.lg, marginVertical: 25 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: PSBColors.primary.green, marginBottom: 15 },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statCard: {
    flex: 1,
    backgroundColor: PSBColors.background.card,
    borderWidth: 1,
    borderColor: PSBColors.primary.gold,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginHorizontal: 5,
    ...PSBShadows.sm,
  },
  statValue: { fontSize: 20, fontWeight: "bold", color: PSBColors.primary.green, marginTop: 8 },
  statLabel: { fontSize: 12, color: PSBColors.text.secondary, textAlign: "center", marginTop: 4 },

  featuresContainer: { paddingHorizontal: PSBSpacing.lg, marginBottom: 30 },
  featuresGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  featureCard: {
    width: (width - 50) / 2,
    height: 160,
    marginBottom: 15,
    borderRadius: 16,
    overflow: "hidden",
    ...PSBShadows.md,
  },
  featureGradient: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
  },
  featureTitle: { fontSize: 16, fontWeight: "bold", marginTop: 12, textAlign: "center", color: PSBColors.primary.green },
  featureDescription: { fontSize: 12, color: PSBColors.text.secondary, textAlign: "center", marginTop: 8, lineHeight: 16 },

  tipsContainer: { paddingHorizontal: PSBSpacing.lg, marginBottom: 30 },
  tipCard: {
    backgroundColor: PSBColors.background.card,
    borderRadius: 12,
    padding: PSBSpacing.lg,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: PSBColors.primary.gold,
  },
  tipIcon: { fontSize: 24, marginRight: 15 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 16, fontWeight: "bold", color: PSBColors.primary.green, marginBottom: 8 },
  tipText: { fontSize: 14, color: PSBColors.text.secondary, lineHeight: 20 },
});

export default HomeScreen;
