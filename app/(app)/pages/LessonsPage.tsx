import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import {
  GraduationCap,
  Target,
  TrendingUp,
  Star,
  Users,
  Award,
  ChevronRight,
  BookOpen,
  Clock,
} from "lucide-react-native";
import { CourseCard } from "../../../components/CourseCard";
import { LessonViewer } from "../../../components/LessonViewer";
import { courses } from "../../../data/lessons";
import { Course, Lesson, Progress } from "../../../types/lesson";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const colors = {
  primary: "#3B82F6",
  primaryLight: "#60A5FA",
  primaryDark: "#1D4ED8",
  secondary: "#10B981",
  accent: "#8B5CF6",
  background: "#FFFFFF",
  backgroundSecondary: "#F8FAFC",
  text: "#1F2937",
  textSecondary: "#6B7280",
  textLight: "#9CA3AF",
  border: "#E5E7EB",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
};

export default function LessonsPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);

  const handleStartCourse = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setSelectedLesson(course.lessons[0]);
      console.log(course.lessons[0].id, course.id);
      router.push(
        "/pages/Lesson?lessonId=" +
          course.lessons[0].id +
          "&courseId=" +
          course.id
      );
    }
  };

  const getProgressForCourse = (courseId: string) => {
    const courseProgress = progress.find((p) => p.courseId === courseId);
    if (!courseProgress) return 0;
    const course = courses.find((c) => c.id === courseId);
    if (!course) return 0;
    return (
      (courseProgress.completedLessons.length / course.lessons.length) * 100
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.audioLessonsContainer}>
          <Text style={styles.audioLessonsTitle}>
            Also Try our Audio Lessons
          </Text>
          <TouchableOpacity
            style={styles.audioLessonsButton}
            onPress={() => router.push("/pages/AudioLessons")}
          >
            <Text style={styles.audioLessonsButtonText}>Listen Now</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        {/* <View style={styles.heroSection}>
          {/* <View style={styles.heroBackground}>
            <View style={styles.heroPattern} />
          </View> 
          <View style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <View style={styles.heroIcon}>
                <GraduationCap size={32} color={colors.white} />
              </View>
              <Text style={styles.heroSubtitle}>PocketWise Learn</Text>
            </View>

            <Text style={styles.heroTitle}>
              Master Your{"\n"}Financial Future
            </Text>
            <Text style={styles.heroDescription}>
              Transform your relationship with money through expert-crafted
              micro-lessons. Build wealth, reduce stress, and achieve financial
              freedom.
            </Text>

            <View style={styles.heroStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>15K+</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>4.9★</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>80+</Text>
                <Text style={styles.statLabel}>Lessons</Text>
              </View>
            </View>

            <View style={styles.heroFeatures}>
              <View style={styles.featureItem}>
                <Award size={18} color={colors.white} />
                <Text style={styles.featureText}>
                  Expert-crafted curriculum
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Target size={18} color={colors.white} />
                <Text style={styles.featureText}>Practical strategies</Text>
              </View>
              <View style={styles.featureItem}>
                <TrendingUp size={18} color={colors.white} />
                <Text style={styles.featureText}>
                  Build wealth systematically
                </Text>
              </View>
            </View>
          </View>
        </View> */}

        {/* Quick Stats Section */}
        {/* <View style={styles.quickStatsSection}>
          <View style={styles.quickStatsContainer}>
            <View style={styles.quickStatCard}>
              <Users size={24} color={colors.primary} />
              <Text style={styles.quickStatTitle}>Join 15,000+ learners</Text>
              <Text style={styles.quickStatDesc}>
                Building financial confidence
              </Text>
            </View>
            <View style={styles.quickStatCard}>
              <Clock size={24} color={colors.accent} />
              <Text style={styles.quickStatTitle}>15-min lessons</Text>
              <Text style={styles.quickStatDesc}>
                Perfect for busy schedules
              </Text>
            </View>
          </View>
        </View> */}

        {/* Courses Section */}
        <View style={styles.coursesSection}>
          {/* <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Learning Journey</Text>
            <Text style={styles.sectionDescription}>
              Master essential financial skills through our structured learning
              paths. Each course builds upon the previous, creating a
              comprehensive financial education.
            </Text>
          </View> */}

          <View style={styles.coursesGrid}>
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={getProgressForCourse(course.id)}
                onStartCourse={handleStartCourse}
              />
            ))}
          </View>

          {/* <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>Explore All Courses</Text>
            <ChevronRight size={20} color={colors.primary} />
          </TouchableOpacity> */}
        </View>

        {/* Features Section */}
        {/* <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Why Choose PocketWise?</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <BookOpen size={28} color={colors.primary} />
              <Text style={styles.featureCardTitle}>Bite-sized Learning</Text>
              <Text style={styles.featureCardDesc}>
                Complete lessons in 15 minutes or less
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Target size={28} color={colors.secondary} />
              <Text style={styles.featureCardTitle}>Practical Focus</Text>
              <Text style={styles.featureCardDesc}>
                Real-world strategies you can use today
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Star size={28} color={colors.accent} />
              <Text style={styles.featureCardTitle}>Expert Content</Text>
              <Text style={styles.featureCardDesc}>
                Created by financial professionals
              </Text>
            </View>
            <View style={styles.featureCard}>
              <TrendingUp size={28} color={colors.warning} />
              <Text style={styles.featureCardTitle}>Track Progress</Text>
              <Text style={styles.featureCardDesc}>
                Monitor your financial learning journey
              </Text>
            </View>
          </View> 
        </View>*/}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: colors.primary,
    paddingTop: 32,
    paddingBottom: 48,
    paddingHorizontal: 24,
    position: "relative",
    overflow: "hidden",
  },
  heroBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  heroPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    opacity: 0.8,
  },
  heroContent: {
    alignItems: "center",
    maxWidth: width - 48,
    zIndex: 1,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
    opacity: 0.9,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: "800",
    color: colors.white,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 50,
  },
  heroDescription: {
    fontSize: 18,
    color: colors.white,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 26,
    opacity: 0.9,
    maxWidth: width - 80,
  },
  heroStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 32,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 16,
  },
  heroFeatures: {
    gap: 12,
    alignItems: "flex-start",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  featureText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: "500",
  },
  quickStatsSection: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: colors.backgroundSecondary,
  },
  quickStatsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickStatTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
    textAlign: "center",
  },
  quickStatDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  coursesSection: {
    // paddingVertical: 48,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: width - 48,
  },
  coursesGrid: {
    gap: 20,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewAllButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  featuresSection: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: colors.gray[50],
  },
  featuresTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 32,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  featureCard: {
    width: (width - 64) / 2,
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  featureCardDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  audioLessonsContainer: {
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    marginHorizontal: 10,
    borderRadius: 12,
    marginBottom: 24,
  },
  audioLessonsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  audioLessonsButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  audioLessonsButtonText: {
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
  },
});
