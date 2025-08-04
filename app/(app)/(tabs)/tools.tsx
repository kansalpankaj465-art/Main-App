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
  ChartBar as BarChart3,
  Building,
  ChartPie as PieChart,
  Calculator,
  Zap,
  ChevronRight,
  File,
  Link,
} from "lucide-react-native";
import ChatbotButton from "../../../components/ChatbotButton";
import ChatbotPopup from "../../../components/ChatbotPopup";
import PSBColors from "../../../constants/colors";

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
    id: "DocHashVerifier",
    title: "Document Hash Verifier",
    description: "Verify the integrity of documents using hash functions",
    icon: File,
    category: "fraud",
    route: "/pages/DocHashVerifierTool",
  },
  {
    id: "url-analysis-tool",
    title: "URL Analyzer",
    description:
      "Master advanced fraud detection techniques using machine learning algorithms",
    icon: Link,
    category: "fraud",
    route: "/pages/UrlAnalysisTool",
  },
  {
    id: "nearest-cybercell-finder",
    title: "Nearest Cybercell Finder",
    description: "Find the nearest cybercell to your location",
    icon: Link,
    category: "fraud",
    route: "/pages/NearestCybercellFinder",
  },

  {
    id: "sip-calculator",
    title: "SIP Calculator",
    description: "Calculate your SIP returns with ease",
    icon: BarChart3,
    category: "financial",
    route: "/pages/SipTool",
  },
  {
    id: "fd-rd-calculator",
    title: "FD & RD Calculator",
    description: "Calculate your FD & RD returns with ease",
    icon: TrendingUp,
    category: "financial",
    route: "/pages/FdAndRdCalculator",
  },
  {
    id: "interest-emi-calculator",
    title: "Interest & EMI Calculator",
    description: "Calculate your interest & EMI with ease",
    icon: Calculator,
    category: "financial",
    route: "/pages/InterestCalculator",
  },
  {
    id: "tax-calculator",
    title: "Tax Calculator",
    description: "Calculate your tax with ease",
    icon: BarChart3,
    category: "financial",
    route: "/pages/TaxCalculator",
  },
];

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
              <Zap size={32} color={PSBColors.white} strokeWidth={2.5} />
            </View>
            <View>
              <Text style={styles.brandTitle}>PSB FinTools</Text>
              <Text style={styles.brandSubtitle}>
                Punjab & Sind Bank Financial Tools
              </Text>
            </View>
          </View>
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
            title="Security & Fraud Prevention"
            subtitle="PSB's advanced security tools and fraud detection"
            icon={Shield}
            color={PSBColors.primary}
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
            subtitle="Professional financial planning tools"
            icon={Building}
            color={PSBColors.secondary}
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
    backgroundColor: PSBColors.gray[50],
  },
  heroHeader: {
    backgroundColor: PSBColors.primary,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
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
    backgroundColor: PSBColors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: PSBColors.white,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    color: PSBColors.gray[200],
    fontWeight: "500",
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 20,
  },
  statCard: {
    alignItems: "center",
    backgroundColor: "#374151",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 70,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#9CA3AF",
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
    paddingHorizontal: 20,
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
    backgroundColor: PSBColors.white,
    borderRadius: 12,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: PSBColors.card.border,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
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
    color: "#9CA3AF",
    fontWeight: "500",
  },
});
