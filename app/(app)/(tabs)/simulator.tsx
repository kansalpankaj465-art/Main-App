import React, { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  ImageBackground,
} from "react-native";
import {
  Shield,
  CreditCard,
  TrendingUp,
  TriangleAlert as AlertTriangle,
  DollarSign,
  ChartBar as BarChart3,
  Users,
  Lock,
  Smartphone,
  Building,
  ChartPie as PieChart,
  Calculator,
  Zap,
  Star,
  ChevronRight,
  Target,
  Award,
} from "lucide-react-native";
import { PSBColors, PSBShadows, PSBSpacing } from "../../../utils/PSBColors";
import ChatbotButton from "../../../components/ChatbotButton";
import ChatbotPopup from "../../../components/ChatbotPopup";

const { width, height } = Dimensions.get("window");

interface SimulatorModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: "fraud" | "financial";
  route: string;
}

const simulatorModules: SimulatorModule[] = [
  {
    id: "ponzi-scheme-simulator",
    title: "Ponzi Scheme Simulator",
    description:
      "Master advanced fraud detection techniques using machine learning algorithms",
    icon: AlertTriangle,
    category: "fraud",
    route: "/pages/PonziSimulator",
  },
  {
    id: "charity-scam-simulator",
    title: "Charity Scam Simulator",
    description:
      "Master advanced fraud detection techniques using machine learning algorithms",
    icon: CreditCard,
    category: "fraud",
    route: "/pages/charityScamSimulator",
  },
  {
    id: "identity-theft",
    title: "Identity Theft Simulation",
    description:
      "Learn to identify and prevent sophisticated identity theft schemes",
    icon: Users,
    category: "fraud",
    route: "/pages/identityTheftSimulator",
  },
  {
    id: "phishing-simulation",
    title: "Phishing Simulation",
    description: "Detect and counter advanced phishing attacks.",
    icon: Smartphone,
    category: "fraud",
    route: "/pages/PhishingSimulator",
  },
  {
    id: "lottery-fraud-simulator",
    title: "Lottery Fraud Simulation",
    description:
      "Analyze complex transaction patterns to identify fraudulent activities",
    icon: AlertTriangle,
    category: "fraud",
    route: "/pages/lotteryFraudSimulator",
  },
  {
    id: "loan-fraud-simulator",
    title: "Loan Fraud Simulation",
    description:
      "Analyze complex transaction patterns to identify fraudulent activities",
    icon: DollarSign,
    category: "fraud",
    route: "/pages/loanScamSimulator",
  },
  {
    id: "portfolio-management",
    title: "Portfolio Optimization",
    description:
      "Build and optimize investment portfolios using modern portfolio theory",
    icon: PieChart,
    category: "financial",
    route: "/simulators/portfolio-management",
  },
  {
    id: "risk-assessment",
    title: "Risk Assessment & Management",
    description:
      "Evaluate and manage financial risks using quantitative models",
    icon: BarChart3,
    category: "financial",
    route: "/simulators/risk-assessment",
  },
  {
    id: "market-analysis",
    title: "Market Trend Analysis",
    description:
      "Analyze market trends and make data-driven investment decisions",
    icon: TrendingUp,
    category: "financial",
    route: "/simulators/market-analysis",
  },
  {
    id: "loan-calculator",
    title: "Advanced Loan Modeling",
    description:
      "Create sophisticated loan models with risk assessment capabilities",
    icon: Calculator,
    category: "financial",
    route: "/simulators/loan-calculator",
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "#10B981";
    case "Intermediate":
      return "#F59E0B";
    case "Advanced":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

const ModuleCard: React.FC<{ module: SimulatorModule; index: number }> = ({
  module,
}) => {
  const categoryColors = {
    fraud: {
      primary: "#DC2626",
      secondary: "#F9FAFB",
    },
    financial: {
      primary: "#2563EB",
      secondary: "#F9FAFB",
    },
  };

  const colors = categoryColors[module.category];

  const handlePress = () => {
    router.push(module.route as any);
  };

  return (
    <TouchableOpacity
      style={styles.moduleCard}
      onPress={handlePress}
      activeOpacity={0.95}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconWrapper, { backgroundColor: colors.primary }]}>
          <module.icon size={24} color="#FFFFFF" strokeWidth={2} />
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.moduleDescription} numberOfLines={2}>
            {module.description}
          </Text>

          {/* <View style={styles.cardMeta}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(module.difficulty) },
              ]}
            >
              <Text style={styles.difficultyText}>{module.difficulty}</Text>
            </View>
            <Text style={styles.durationText}>{module.duration}</Text>
          </View> */}
        </View>

        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

const CategoryHeader: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
}> = ({ title, subtitle, icon: Icon, color }) => (
  <View style={styles.categoryHeader}>
    {/* <View style={[styles.categoryIcon, { backgroundColor: color }]}>
      <Icon size={20} color="#FFFFFF" strokeWidth={2} />
    </View> */}
    <View style={styles.categoryInfo}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <Text style={styles.categorySubtitle}>{subtitle}</Text>
    </View>
  </View>
);

export default function SimulatorsScreen() {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const fraudModules = simulatorModules.filter((m) => m.category === "fraud");
  const financialModules = simulatorModules.filter(
    (m) => m.category === "financial"
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

      {/* Hero Header */}
      <View style={styles.heroHeader}>
        <View style={styles.heroContent}>
          <View style={styles.brandContainer}>
            <View style={styles.logoContainer}>
              <Zap size={32} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View>
              <Text style={styles.brandTitle}>FinSim Academy</Text>
              <Text style={styles.brandSubtitle}>
                Professional Training Platform
              </Text>
            </View>
          </View>

          {/* <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{simulatorModules.length}</Text>
              <Text style={styles.statLabel}>Simulators</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>4.7</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View> */}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Fraud Detection Section */}
        <View style={styles.section}>
          <CategoryHeader
            title="Fraud Detection & Prevention"
            subtitle="Master advanced fraud detection techniques"
            icon={Shield}
            color="#DC2626"
          />
          <View style={styles.modulesList}>
            {fraudModules.map((module, index) => (
              <ModuleCard key={module.id} module={module} index={index} />
            ))}
          </View>
        </View>

        {/* Financial Analysis Section */}
        <View style={styles.section}>
          <CategoryHeader
            title="Financial Analysis & Modeling"
            subtitle="Build expertise in financial markets"
            icon={Building}
            color="#2563EB"
          />
          <View style={styles.modulesList}>
            {financialModules.map((module, index) => (
              <ModuleCard key={module.id} module={module} index={index} />
            ))}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PSBColors.background.secondary,
  },
  heroHeader: {
    backgroundColor: PSBColors.primary.green,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: PSBSpacing.lg,
  },
  heroContent: {
    alignItems: "center",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PSBColors.primary.gold,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    ...PSBShadows.lg,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: PSBColors.text.inverse,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    color: PSBColors.text.inverse,
    fontWeight: "500",
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 20,
  },
  statCard: {
    alignItems: "center",
    backgroundColor: PSBColors.primary.darkGreen,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 70,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: PSBColors.text.inverse,
  },
  statLabel: {
    fontSize: 12,
    color: PSBColors.text.inverse,
    marginTop: 2,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: PSBSpacing.lg,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: PSBColors.text.primary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  categorySubtitle: {
    fontSize: 15,
    color: PSBColors.text.secondary,
    fontWeight: "400",
    lineHeight: 20,
  },
  modulesList: {
    gap: 12,
  },
  moduleCard: {
    backgroundColor: PSBColors.background.card,
    borderRadius: 12,
    ...PSBShadows.sm,
    borderWidth: 1,
    borderColor: PSBColors.border.primary,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: PSBSpacing.lg,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: PSBColors.text.primary,
    marginBottom: 6,
    lineHeight: 24,
  },
  moduleDescription: {
    fontSize: 14,
    color: PSBColors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  durationText: {
    fontSize: 13,
    color: PSBColors.text.tertiary,
    fontWeight: "500",
  },
});
