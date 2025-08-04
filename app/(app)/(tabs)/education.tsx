import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BookOpen,
  Lightbulb,
  ExternalLink,
  Building2,
  Shield,
  GraduationCap,
  Globe,
  Phone,
  Mail,
} from "lucide-react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { router } from "expo-router";
import LessonsPage from "../pages/LessonsPage";
import PSBColors from "../../../constants/colors";

const EducationScreen = () => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<
    "glossary" | "lessons" | "resources"
  >("lessons");

  const glossaryItems = [
    {
      term: "Ponzi Scheme",
      definition:
        "A fraudulent investment operation that pays returns to existing investors using capital from new investors, rather than from legitimate business operations.",
      example:
        "Bernie Madoff's investment scandal was one of the largest Ponzi schemes in history.",
    },
    {
      term: "Pyramid Scheme",
      definition:
        "A business model that recruits members via a promise of payments for enrolling others into the scheme, rather than supplying investments or sale of products.",
      example:
        "A pyramid scheme might involve members paying an entry fee and earning money solely by bringing in new recruits.",
    },
    {
      term: "Identity Theft",
      definition:
        "The fraudulent acquisition and use of someone's personal information, usually for financial gain.",
      example:
        "Hackers used stolen social security numbers to open credit cards in victims’ names.",
    },
    {
      term: "Credit Card Fraud",
      definition:
        "Unauthorized use of another person's credit card information to make purchases or withdraw funds.",
      example:
        "A fraudster used a skimming device at an ATM to steal card data and make unauthorized purchases.",
    },
    {
      term: "Phishing Scam",
      definition:
        "A cyber attack where criminals pose as legitimate institutions to lure individuals into providing sensitive data such as passwords and banking information.",
      example:
        "A victim received an email that looked like it was from their bank, asking them to confirm account details via a fake link.",
    },
    {
      term: "Investment Fraud",
      definition:
        "Deceptive practices to convince individuals to invest in worthless, nonexistent, or misrepresented investment opportunities.",
      example:
        "The company promised unrealistic returns on fake cryptocurrency investments.",
    },
    {
      term: "Mortgage Fraud",
      definition:
        "A type of fraud involving the misrepresentation of information to obtain a mortgage loan or better loan terms dishonestly.",
      example:
        "A buyer lied about their income and assets to get approved for a larger mortgage.",
    },
    {
      term: "Tax Scam",
      definition:
        "A fraudulent scheme where scammers promise large tax refunds or reduced liabilities through false information or illegal methods.",
      example:
        "A fake tax preparer filed false returns to claim inflated deductions for clients and took a cut of the refunds.",
    },
    {
      term: "Lottery and Sweepstakes Fraud",
      definition:
        "Scammers tell victims they’ve won a lottery or prize but must pay fees or taxes upfront to claim it.",
      example:
        "The victim received a letter claiming they won a foreign lottery and had to wire money for processing fees.",
    },
    {
      term: "Charity Scam",
      definition:
        "Fraudulent solicitation of donations for causes that don’t exist or don’t benefit the stated beneficiaries.",
      example:
        "After a natural disaster, scammers created fake websites to collect donations from well-meaning individuals.",
    },
    {
      term: "Debt Relief Scam",
      definition:
        "A scheme that falsely promises to reduce or eliminate a person’s debt in exchange for upfront fees, but delivers little or no actual relief.",
      example:
        "The company charged high fees and claimed they would negotiate with creditors but never followed through.",
    },
    {
      term: "Fake Check Scam",
      definition:
        "A scam where the victim is sent a counterfeit check and asked to send back money before the check clears and bounces.",
      example:
        "A victim was hired for a mystery shopper job, sent a fake check, and asked to send back a portion in gift cards.",
    },
    {
      term: "Online Banking Fraud",
      definition:
        "Unauthorized access to or manipulation of online banking accounts through hacking, phishing, or social engineering.",
      example:
        "Hackers used stolen credentials to transfer funds from the victim’s bank account to overseas accounts.",
    },
    {
      term: "Employment Fraud",
      definition:
        "Scams involving fake job offers that require payment for training, equipment, or background checks, but never lead to actual employment.",
      example:
        "A victim paid for a work-from-home training kit that never arrived and was unable to contact the employer again.",
    },
    {
      term: "Student Loan Scam",
      definition:
        "A fraud involving fake companies that offer to reduce or erase student loan debt in exchange for fees but provide no actual service.",
      example:
        "The student was tricked into paying a fee for loan forgiveness assistance that never materialized.",
    },
    {
      term: "Old Tax Regime",
      definition:
        "A tax system where taxpayers can reduce their taxable income through various deductions such as under Sections 80C, 80D, HRA, LTA, and home loan interest.",
      example:
        "A taxpayer reduced their tax by ₹1.5L using 80C and another ₹2L using home loan interest.",
    },
  ];

  const resources = [
    {
      title: "SEBI Investor Portal",
      description:
        "Securities and Exchange Board of India - Official investor protection portal",
      url: "https://www.sebi.gov.in",
      icon: Building2,
    },
    {
      title: "RBI Consumer Education",
      description: "Reserve Bank of India - Banking and financial awareness",
      url: "https://www.rbi.org.in",
      icon: Building2,
    },
    {
      title: "Cybercrime Reporting",
      description: "Report financial fraud and cybercrime to authorities",
      url: "https://cybercrime.gov.in",
      icon: Shield,
    },
    {
      title: "PFMS Scholarship",
      description:
        "Public Financial Management System - Government schemes verification",
      url: "https://pfms.nic.in",
      icon: GraduationCap,
    },
  ];

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  const renderGlossary = () => (
    <View>
      {glossaryItems.map((item, index) => (
        <View
          key={index}
          style={[
            styles.glossaryCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              borderWidth: 0.4,
            },
          ]}
        >
          <TouchableOpacity
            key={index}
            onPress={() =>
              router.push("/pages/FraudDetails?fraud=" + item.term)
            }
            activeOpacity={0.8}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.glossaryTerm, { color: theme.colors.text }]}>
                {item.term}
              </Text>
              <ExternalLink size={22} color={theme.colors.textSecondary} />
            </View>
            <Text
              style={[styles.glossaryDefinition, { color: theme.colors.text }]}
            >
              {item.definition}
            </Text>
            <View
              style={[
                styles.exampleContainer,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: 0.2,
                },
              ]}
            >
              <Text style={styles.exampleIcon}>💡</Text>
              <Text
                style={[styles.glossaryExample, { color: theme.colors.text }]}
              >
                {item.example}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
      <View style={styles.emergencyCard}>
        <Text style={styles.emergencyTitle}>🚨 Report Fraud Immediately</Text>
        <Text style={styles.emergencyText}>
          If you've been a victim of fraud or suspect fraudulent activity,
          report it immediately through these official channels:
        </Text>
        <View style={styles.emergencyContacts}>
          <View style={styles.contactItem}>
            <Phone size={16} color="#EF4444" />
            <Text style={styles.emergencyContact}>
              Cyber Crime Helpline: 1930
            </Text>
          </View>
          <View style={styles.contactItem}>
            <Globe size={16} color="#EF4444" />
            <Text style={styles.emergencyContact}>cybercrime.gov.in</Text>
          </View>
          <View style={styles.contactItem}>
            <Mail size={16} color="#EF4444" />
            <Text style={styles.emergencyContact}>
              report.phishing@rbi.org.in
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderLessons = () => <LessonsPage />;

  const renderResources = () => (
    <View>
      {resources.map((resource, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.resourceCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              borderWidth: 0.4,
            },
          ]}
          onPress={() => handleLinkPress(resource.url)}
          activeOpacity={0.8}
        >
          <View style={styles.resourceHeader}>
            <resource.icon size={24} color="#45b7d1" />
            <View style={styles.resourceContent}>
              <Text
                style={[styles.resourceTitle, { color: theme.colors.text }]}
              >
                {resource.title}
              </Text>
              <Text
                style={[
                  styles.resourceDescription,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {resource.description}
              </Text>
            </View>
            <ExternalLink size={22} color={theme.colors.textSecondary} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <LinearGradient
      colors={PSBColors.gradients.neutral}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.bankHeader}>
            <Text style={styles.bankName}>Punjab & Sind Bank</Text>
            <Text style={styles.bankTagline}>Financial Education Center</Text>
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Security Education
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Learn to protect yourself from financial fraud and scams.
          </Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor: PSBColors.white,
                borderColor: PSBColors.card.border,
                borderWidth: 1,
                shadowColor: PSBColors.card.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              },
              selectedTab === "lessons" && { backgroundColor: PSBColors.primary },
            ]}
            onPress={() => setSelectedTab("lessons")}
          >
            <Lightbulb
              size={20}
              color={selectedTab === "lessons" ? PSBColors.white : PSBColors.primary}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    selectedTab === "lessons" ? PSBColors.white : PSBColors.primary,
                },
              ]}
            >
              Lessons
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor: PSBColors.white,
                borderColor: PSBColors.card.border,
                borderWidth: 1,
                shadowColor: PSBColors.card.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              },
              selectedTab === "glossary" && { backgroundColor: PSBColors.primary },
            ]}
            onPress={() => setSelectedTab("glossary")}
          >
            <BookOpen
              size={20}
              color={selectedTab === "glossary" ? PSBColors.white : PSBColors.primary}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    selectedTab === "glossary" ? PSBColors.white : PSBColors.primary,
                },
              ]}
            >
              Glossary
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor: PSBColors.white,
                borderColor: PSBColors.card.border,
                borderWidth: 1,
                shadowColor: PSBColors.card.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              },
              selectedTab === "resources" && { backgroundColor: PSBColors.primary },
            ]}
            onPress={() => setSelectedTab("resources")}
          >
            <ExternalLink
              size={20}
              color={selectedTab === "resources" ? PSBColors.white : PSBColors.primary}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    selectedTab === "resources" ? PSBColors.white : PSBColors.primary,
                },
              ]}
            >
              Resources
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {selectedTab === "glossary" && renderGlossary()}
          {selectedTab === "lessons" && renderLessons()}
          {selectedTab === "resources" && renderResources()}
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  bankHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  bankName: {
    fontSize: 18,
    fontWeight: "bold",
    color: PSBColors.primary,
    letterSpacing: 0.5,
  },
  bankTagline: {
    fontSize: 12,
    color: PSBColors.text.secondary,
    marginTop: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  glossaryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  glossaryTerm: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4ecdc4",
    marginBottom: 10,
  },
  glossaryDefinition: {
    fontSize: 14,
    color: "white",
    lineHeight: 20,
    marginBottom: 15,
  },
  exampleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 217, 61, 0.1)",
    borderRadius: 8,
    padding: 12,
  },
  exampleIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  glossaryExample: {
    fontSize: 13,
    color: "#b8b8b8",
    fontStyle: "italic",
    flex: 1,
    lineHeight: 18,
  },
  tipCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tipIconText: {
    fontSize: 24,
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 12,
  },
  tipDescription: {
    fontSize: 14,
    color: "#b8b8b8",
    lineHeight: 20,
  },
  resourceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  resourceHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  resourceContent: {
    flex: 1,
    marginLeft: 15,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: "#b8b8b8",
    lineHeight: 18,
  },
  emergencyCard: {
    backgroundColor: "#FEF2F2",
    marginHorizontal: 2,
    marginBottom: 24,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#DC2626",
    marginBottom: 12,
  },
  emergencyText: {
    fontSize: 14,
    color: "#7F1D1D",
    marginBottom: 16,
    lineHeight: 20,
  },
  emergencyContacts: {
    gap: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emergencyContact: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7F1D1D",
  },
});

export default EducationScreen;
