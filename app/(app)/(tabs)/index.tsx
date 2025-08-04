import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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
import ThemeToggle from "../../../components/ThemeToggle";
import ChatbotButton from "../../../components/ChatbotButton";
import ChatbotPopup from "../../../components/ChatbotPopup";
import PSBColors from "../../../constants/colors";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const features = [
    {
      id: 1,
      title: "Simulators",
      description: "Experience how fraud schemes work from the inside",
      icon: Brain,
      color: PSBColors.primary,
      route: "/(tabs)/simulator",
    },
    {
      id: 2,
      title: "Quizzes",
      description: "Test your knowledge of everything that you learned",
      icon: Flag,
      color: PSBColors.secondary,
      route: "/pages/QuizzesScreen",
    },

    {
      id: 4,
      title: "Education Center",
      description: "Comprehensive fraud awareness resources",
      icon: GraduationCap,
      color: PSBColors.primaryLight,
      route: "/(app)/(tabs)/education",
    },
    {
      id: 5,
      title: "Story Mode",
      description: "Practice real-world financial decisions",
      icon: Target,
      color: PSBColors.secondaryDark,
      route: "/pages/ScenarioHub",
    },
  ];

  const stats = [
    { label: "Schemes Exposed", value: "50+", icon: Eye, color: PSBColors.primary },
    { label: "Users Protected", value: "10K+", icon: Shield, color: PSBColors.secondary },
    { label: "Success Rate", value: "95%", icon: TrendingUp, color: PSBColors.success },
  ];

  return (
    <LinearGradient
      colors={PSBColors.gradients.neutral}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.logoSpace}>
                <Text style={styles.bankName}>Punjab & Sind Bank</Text>
                <Text style={styles.tagline}>Your Trusted Banking Partner</Text>
              </View>
              <Text style={[styles.greeting, { color: theme.colors.text }]}>
                Welcome back!
              </Text>
              <Text
                style={[styles.subtitle, { color: theme.colors.textSecondary }]}
              >
                Secure your financial future
              </Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <ThemeToggle />
            </TouchableOpacity>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Security Statistics
            </Text>
            <View style={styles.statsRow}>
              {stats.map((stat, index) => (
                <View
                  key={index}
                  style={[
                    styles.statCard,
                    { 
                      backgroundColor: PSBColors.white,
                      borderLeftWidth: 4,
                      borderLeftColor: stat.color,
                    },
                  ]}
                >
                  <stat.icon size={24} color={stat.color} />
                  <Text
                    style={[styles.statValue, { color: theme.colors.text }]}
                  >
                    {stat.value}
                  </Text>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Explore Features
            </Text>
            <View style={styles.featuresGrid}>
              {features.map((feature) => (
                <TouchableOpacity
                  key={feature.id}
                  style={styles.featureCard}
                  onPress={() => router.push(feature.route as any)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.featureGradient, { backgroundColor: feature.color }]}>
                    <feature.icon size={32} color="black" />
                    <Text style={[styles.featureTitle, { color: "black" }]}>
                      {feature.title}
                    </Text>
                    <Text
                      style={[styles.featureDescription, { color: "black" }]}
                    >
                      {feature.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Tips */}
          <View style={styles.tipsContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Security Tip
            </Text>
            <View
              style={[styles.tipCard, { 
                backgroundColor: PSBColors.white,
                borderLeftWidth: 4,
                borderLeftColor: PSBColors.warning,
              }]}
            >
              <Text style={[styles.tipIcon, { color: PSBColors.warning }]}>
                💡
              </Text>
              <View style={styles.tipContent}>
                <Text style={[styles.tipTitle, { color: theme.colors.text }]}>
                  Security Alert!
                </Text>
                <Text
                  style={[
                    styles.tipText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Always verify banking communications through official PSB channels. 
                  We never ask for sensitive information via email or SMS.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        {/* Floating Chatbot Button */}
        <ChatbotButton onPress={() => setPopupVisible(true)} />

        {/* Popup */}
        <ChatbotPopup
          visible={isPopupVisible}
          onClose={() => setPopupVisible(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  logoSpace: {
    marginBottom: 16,
  },
  bankName: {
    fontSize: 20,
    fontWeight: "bold",
    color: PSBColors.primary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 12,
    color: PSBColors.text.secondary,
    marginTop: 2,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PSBColors.gray[100],
    justifyContent: "center",
    alignItems: "center",
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: PSBColors.white,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: PSBColors.text.secondary,
    textAlign: "center",
    marginTop: 4,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: (width - 50) / 2,
    height: 160,
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  featureGradient: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 16,
  },
  tipsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  tipCard: {
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default HomeScreen;
