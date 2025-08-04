import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  Shield,
  DollarSign,
  CheckCircle,
  Clock,
  Star,
  Zap,
  Trophy,
  Target,
} from "lucide-react-native";
import { Quiz, getUserProgress } from "../data/quizData";
import PSBColors from "../constants/colors";

interface QuizCardProps {
  quiz: Quiz;
  onPress: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onPress }) => {
  const progress = getUserProgress();
  const isCompleted = progress[quiz.id]?.completed || false;
  const score = progress[quiz.id]?.score || 0;
  const attempts = progress[quiz.id]?.attempts || 0;

  const CategoryIcon = quiz.category === "fraud" ? Shield : DollarSign;

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return {
          color: PSBColors.success,
          bg: PSBColors.success + "20",
          gradient: [PSBColors.success, PSBColors.primaryLight],
          icon: Target,
        };
      case "intermediate":
        return {
          color: PSBColors.warning,
          bg: PSBColors.warning + "20",
          gradient: [PSBColors.warning, PSBColors.secondaryDark],
          icon: Zap,
        };
      case "advanced":
        return {
          color: PSBColors.error,
          bg: PSBColors.error + "20",
          gradient: [PSBColors.error, PSBColors.error],
          icon: Trophy,
        };
      default:
        return {
          color: PSBColors.gray[500],
          bg: PSBColors.gray[100],
          gradient: [PSBColors.gray[500], PSBColors.gray[400]],
          icon: Star,
        };
    }
  };

  const difficultyConfig = getDifficultyConfig(quiz.difficulty);
  const DifficultyIcon = difficultyConfig.icon;

  const getScoreColor = (score: number) => {
    if (score >= 4) return PSBColors.success;
    if (score >= 3) return PSBColors.warning;
    return PSBColors.error;
  };

  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.completedCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Completion Glow Effect */}
      {isCompleted && <View style={styles.completionGlow} />}

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.categorySection}>
          <View
            style={[
              styles.categoryIcon,
              quiz.category === "fraud"
                ? styles.fraudIcon
                : styles.financialIcon,
            ]}
          >
            <CategoryIcon size={16} color="#ffffff" />
          </View>
          <View
            style={[
              styles.categoryBadge,
              quiz.category === "fraud"
                ? styles.fraudBadge
                : styles.financialBadge,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                quiz.category === "fraud"
                  ? styles.fraudText
                  : styles.financialText,
              ]}
            >
              {quiz.category === "fraud"
                ? "Fraud Protection"
                : "Financial Mastery"}
            </Text>
          </View>
        </View>

        {isCompleted && (
          <View style={styles.completionBadge}>
            <View
              style={[
                styles.scoreContainer,
                { backgroundColor: getScoreColor(score) },
              ]}
            >
              <CheckCircle size={14} color="#ffffff" />
              <Text style={styles.scoreText}>{score}/5</Text>
            </View>
            {attempts > 1 && (
              <Text style={styles.attemptsText}>{attempts} attempts</Text>
            )}
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.title}>{quiz.title}</Text>
        <Text style={styles.description}>{quiz.description}</Text>
      </View>

      {/* Meta Information */}
      <View style={styles.metaSection}>
        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: difficultyConfig.bg },
          ]}
        >
          <DifficultyIcon size={12} color={difficultyConfig.color} />
          <Text
            style={[styles.difficultyText, { color: difficultyConfig.color }]}
          >
            {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
          </Text>
        </View>

        <View style={styles.timeContainer}>
          <Clock size={12} color="#6b7280" />
          <Text style={styles.timeText}>{quiz.estimatedTime} min</Text>
        </View>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.questionCount}>5 Questions</Text>
          {isCompleted ? (
            <Text style={[styles.statusText, { color: getScoreColor(score) }]}>
              Best: {score}/5 ({Math.round((score / 5) * 100)}%)
            </Text>
          ) : (
            <Text style={styles.statusText}>Ready to start</Text>
          )}
        </View>

        <View
          style={[
            styles.actionButton,
            isCompleted ? styles.retakeButton : styles.startButton,
          ]}
        >
          {isCompleted ? (
            <>
              <Trophy size={14} color="#6366f1" />
              <Text style={styles.retakeButtonText}>Retake</Text>
            </>
          ) : (
            <>
              <Zap size={14} color="#ffffff" />
              <Text style={styles.startButtonText}>Start</Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: PSBColors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: PSBColors.card.border,
    position: "relative",
    overflow: "hidden",
  },
  completedCard: {
    borderColor: PSBColors.success,
    borderWidth: 1,
  },
  completionGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "140%",
    backgroundColor: PSBColors.success,
    opacity: 0.07,
    shadowColor: PSBColors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  categorySection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  fraudIcon: {
    backgroundColor: PSBColors.error,
  },
  financialIcon: {
    backgroundColor: PSBColors.primary,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  fraudBadge: {
    backgroundColor: PSBColors.error + "20",
  },
  financialBadge: {
    backgroundColor: PSBColors.primary + "20",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  fraudText: {
    color: PSBColors.error,
  },
  financialText: {
    color: PSBColors.primary,
  },
  completionBadge: {
    alignItems: "flex-end",
    gap: 4,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  attemptsText: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "500",
  },
  content: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: PSBColors.text.primary,
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: PSBColors.text.secondary,
    lineHeight: 20,
  },
  metaSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  difficultyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerInfo: {
    flex: 1,
  },
  questionCount: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "600",
    marginBottom: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "500",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  startButton: {
    backgroundColor: "#6366f1",
  },
  retakeButton: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  startButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  retakeButtonText: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default QuizCard;