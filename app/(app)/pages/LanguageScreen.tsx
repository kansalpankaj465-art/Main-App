import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shield, ChevronDown, Globe } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { languages, lessonsData } from "../../../data/lessonsData";
import LessonCard from "../../../components/LessonCard";

const LanguageScreen: React.FC = ({ navigation }: any) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const currentLessons = lessonsData[selectedLanguage] || lessonsData.en;

  const handleStartLesson = (lesson: any) => {
    navigation.navigate("Lesson", { lesson, language: selectedLanguage });
  };

  const selectedLang = languages.find((lang) => lang.code === selectedLanguage);

  return (
    <LinearGradient colors={["#f0f9ff", "#e0f2fe"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={["#3b82f6", "#1d4ed8"]}
                style={styles.logoGradient}
              >
                <Shield size={32} color="white" />
              </LinearGradient>
            </View>
            <Text style={styles.appTitle}>SurakshaCall</Text>
            <Text style={styles.appSubtitle}>
              Learn to protect yourself from fraud with voice-based lessons and
              interactive quizzes
            </Text>
          </View>

          {/* Language Selection */}
          <View style={styles.languageCard}>
            <LinearGradient
              colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.6)"]}
              style={styles.cardGradient}
            >
              <View style={styles.languageHeader}>
                <Globe size={20} color="#1e40af" />
                <Text style={styles.languageTitle}>Select Your Language</Text>
              </View>

              <TouchableOpacity
                style={styles.languageSelector}
                onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
                activeOpacity={0.8}
              >
                <View style={styles.selectedLanguage}>
                  <Text style={styles.languageFlag}>{selectedLang?.flag}</Text>
                  <Text style={styles.languageName}>{selectedLang?.name}</Text>
                </View>
                <ChevronDown
                  size={20}
                  color="#6b7280"
                  style={[
                    styles.chevron,
                    showLanguageDropdown && styles.chevronRotated,
                  ]}
                />
              </TouchableOpacity>

              {showLanguageDropdown && (
                <View style={styles.dropdown}>
                  {languages.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.dropdownItem,
                        selectedLanguage === lang.code &&
                          styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedLanguage(lang.code);
                        setShowLanguageDropdown(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.languageFlag}>{lang.flag}</Text>
                      <Text style={styles.languageName}>{lang.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </LinearGradient>
          </View>

          {/* Lessons Section */}
          <View style={styles.lessonsSection}>
            <View style={styles.lessonsSectionHeader}>
              <Text style={styles.lessonsTitle}>Available Lessons</Text>
              <Text style={styles.lessonsCount}>
                {currentLessons.length} lesson
                {currentLessons.length !== 1 ? "s" : ""}
              </Text>
            </View>

            <View style={styles.lessonsContainer}>
              {currentLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onStart={handleStartLesson}
                />
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Stay safe, stay informed. Protect yourself from fraud.
            </Text>
          </View>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#1e40af",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  languageCard: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#1e40af",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    marginBottom: 24,
  },
  cardGradient: {
    padding: 24,
  },
  languageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  languageTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 12,
  },
  languageSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  selectedLanguage: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    color: "#1f2937",
  },
  chevron: {
    transform: [{ rotate: "0deg" }],
  },
  chevronRotated: {
    transform: [{ rotate: "180deg" }],
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dropdownItemSelected: {
    backgroundColor: "#f0f9ff",
  },
  lessonsSection: {
    marginBottom: 24,
  },
  lessonsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  lessonsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
  },
  lessonsCount: {
    fontSize: 12,
    color: "#6b7280",
  },
  lessonsContainer: {
    gap: 16,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
});

export default LanguageScreen;
