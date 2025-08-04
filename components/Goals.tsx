import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import {
  Target,
  Chrome as Home,
  GraduationCap,
  Car,
  Plane,
  Heart,
  Baby,
  Plus,
  Calendar,
  IndianRupee,
  Briefcase,
  ArrowRight,
  Eye,
  X,
  CircleCheck as CheckCircle,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useGoals } from "../contexts/GoalsContext";

const { width } = Dimensions.get("window");

export default function Goals() {
  const { goals, addGoal, addContribution } = useGoals();
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    amount: "",
    targetDate: "",
    category: "house",
    description: "",
  });

  const goalCategories = [
    {
      id: "house",
      name: "House",
      icon: Home,
      color: "#2563EB",
      gradient: ["#3B82F6", "#1D4ED8"],
    },
    {
      id: "wedding",
      name: "Wedding",
      icon: Heart,
      color: "#EC4899",
      gradient: ["#F472B6", "#DB2777"],
    },
    {
      id: "education",
      name: "Education",
      icon: GraduationCap,
      color: "#7C3AED",
      gradient: ["#8B5CF6", "#6D28D9"],
    },
    {
      id: "car",
      name: "Car",
      icon: Car,
      color: "#059669",
      gradient: ["#10B981", "#047857"],
    },
    {
      id: "vacation",
      name: "Vacation",
      icon: Plane,
      color: "#F59E0B",
      gradient: ["#FBBF24", "#D97706"],
    },
    {
      id: "baby",
      name: "Baby",
      icon: Baby,
      color: "#EF4444",
      gradient: ["#F87171", "#DC2626"],
    },
    {
      id: "emergency",
      name: "Emergency",
      icon: Target,
      color: "#06B6D4",
      gradient: ["#22D3EE", "#0891B2"],
    },
    {
      id: "retirement",
      name: "Retirement",
      icon: Briefcase,
      color: "#8B5CF6",
      gradient: ["#A78BFA", "#7C3AED"],
    },
  ];

  const addNewGoal = () => {
    if (!newGoal.title || !newGoal.amount || !newGoal.targetDate) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const targetAmount = parseFloat(newGoal.amount);
    const targetDate = new Date(newGoal.targetDate);
    const currentDate = new Date();
    const monthsRemaining = Math.max(
      1,
      Math.ceil(
        (targetDate.getTime() - currentDate.getTime()) /
          (1000 * 60 * 60 * 24 * 30)
      )
    );
    const monthlyTarget = Math.ceil(targetAmount / monthsRemaining);

    const goalData = {
      title: newGoal.title,
      targetAmount,
      currentAmount: 0,
      targetDate: newGoal.targetDate,
      category: newGoal.category,
      monthlyTarget,
      description: newGoal.description,
    };

    addGoal(goalData);
    setModalVisible(false);
    setNewGoal({
      title: "",
      amount: "",
      targetDate: "",
      category: "house",
      description: "",
    });
    Alert.alert("Success!", "Your financial goal has been added successfully!");
  };

  const handleAddContribution = (goalId: number) => {
    Alert.prompt(
      "Add Contribution",
      "Enter amount to add:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add",
          onPress: (amount) => {
            const numAmount = parseFloat(amount || "0");
            if (numAmount > 0) {
              addContribution(goalId, numAmount);
              Alert.alert("Success!", `₹${numAmount} added successfully!`);
            }
          },
        },
      ],
      "plain-text",
      "",
      "numeric"
    );
  };

  const getCategoryInfo = (categoryId: string) => {
    return (
      goalCategories.find((cat) => cat.id === categoryId) || goalCategories[0]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const displayedGoals = goals.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}

        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Your Goals</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Plus size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Active Goals */}
        <View style={styles.section}>
          {displayedGoals.map((goal) => {
            const categoryInfo = getCategoryInfo(goal.category);
            const IconComponent = categoryInfo.icon;
            const remainingAmount = goal.targetAmount - goal.currentAmount;
            const targetDate = new Date(goal.targetDate);

            return (
              <TouchableOpacity
                key={goal.id}
                style={styles.goalCard}
                onPress={() => router.push(`/pages/goal-details?id=${goal.id}`)}
              >
                <LinearGradient
                  colors={["#FFFFFF", "#F8FAFC"]}
                  style={styles.goalCardGradient}
                >
                  <View style={styles.goalHeader}>
                    <LinearGradient
                      colors={[
                        categoryInfo.gradient[0],
                        categoryInfo.gradient[1],
                      ]}
                      style={styles.goalIcon}
                    >
                      <IconComponent size={24} color="#FFFFFF" />
                    </LinearGradient>
                    <View style={styles.goalInfo}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={styles.goalAmount}>
                        {formatCurrency(goal.currentAmount)} /{" "}
                        {formatCurrency(goal.targetAmount)}
                      </Text>
                      <Text style={styles.goalRemaining}>
                        {formatCurrency(remainingAmount)} remaining
                      </Text>
                    </View>
                    <View style={styles.goalProgress}>
                      <Text style={styles.progressPercentage}>
                        {goal.progress}%
                      </Text>
                      <Eye size={16} color="#6B7280" />
                    </View>
                  </View>

                  <View style={styles.progressBarContainer}>
                    <LinearGradient
                      colors={[
                        categoryInfo.gradient[0],
                        categoryInfo.gradient[1],
                      ]}
                      style={[
                        styles.progressBarFill,
                        { width: `${goal.progress}%` },
                      ]}
                    />
                  </View>

                  <View style={styles.goalDetails}>
                    <View style={styles.goalDetail}>
                      <Calendar size={16} color="#6B7280" />
                      <Text style={styles.goalDetailText}>
                        Target: {targetDate.toLocaleDateString("en-IN")}
                      </Text>
                    </View>
                    <View style={styles.goalDetail}>
                      <IndianRupee size={16} color="#6B7280" />
                      <Text style={styles.goalDetailText}>
                        {formatCurrency(goal.monthlyTarget)}/month needed
                      </Text>
                    </View>
                  </View>

                  <View style={styles.goalActions}>
                    <TouchableOpacity
                      style={styles.contributeButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAddContribution(goal.id);
                      }}
                    >
                      <Plus size={16} color="#FFFFFF" />
                      <Text style={styles.contributeButtonText}>Add Money</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}

          {/* View All Goals Button */}
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => router.push("/pages/all-goals")}
          >
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.viewAllGradient}
            >
              <Text style={styles.viewAllText}>
                View All Goals ({goals.length})
              </Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>Add New Financial Goal</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Goal Title</Text>
                <TextInput
                  style={styles.input}
                  value={newGoal.title}
                  onChangeText={(text) =>
                    setNewGoal({ ...newGoal, title: text })
                  }
                  placeholder="e.g., Buy a Car, House Down Payment"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target Amount (₹)</Text>
                <TextInput
                  style={styles.input}
                  value={newGoal.amount}
                  onChangeText={(text) =>
                    setNewGoal({ ...newGoal, amount: text })
                  }
                  placeholder="e.g., 1500000"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target Date</Text>
                <TextInput
                  style={styles.input}
                  value={newGoal.targetDate}
                  onChangeText={(text) =>
                    setNewGoal({ ...newGoal, targetDate: text })
                  }
                  placeholder="YYYY-MM-DD (e.g., 2027-12-31)"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newGoal.description}
                  onChangeText={(text) =>
                    setNewGoal({ ...newGoal, description: text })
                  }
                  placeholder="Describe your goal..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categorySelector}>
                  {goalCategories.map((category) => {
                    const IconComponent = category.icon;
                    const isSelected = newGoal.category === category.id;
                    return (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categorySelectorItem,
                          isSelected && styles.categorySelectorItemActive,
                        ]}
                        onPress={() =>
                          setNewGoal({ ...newGoal, category: category.id })
                        }
                      >
                        {isSelected ? (
                          <LinearGradient
                            colors={[
                              category.gradient[0],
                              category.gradient[1],
                            ]}
                            style={styles.categorySelectorGradient}
                          >
                            <IconComponent size={20} color="#FFFFFF" />
                            <Text style={styles.categorySelectorTextActive}>
                              {category.name}
                            </Text>
                          </LinearGradient>
                        ) : (
                          <>
                            <IconComponent size={20} color={category.color} />
                            <Text style={styles.categorySelectorText}>
                              {category.name}
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.createGoalButton}
              onPress={addNewGoal}
            >
              <LinearGradient
                colors={["#10B981", "#047857"]}
                style={styles.createGoalGradient}
              >
                <CheckCircle size={20} color="#FFFFFF" />
                <Text style={styles.createGoalButtonText}>Create Goal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F8FAFC",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    // paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#E0E7FF",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.3)",
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 8,
  },
  challengesContainer: {
    flexDirection: "row",
    gap: 16,
    paddingRight: 20,
  },
  challengeCard: {
    width: width * 0.7,
    borderRadius: 16,
    overflow: "hidden",
  },
  challengeGradient: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  challengeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  challengeReward: {
    fontSize: 14,
    color: "#059669",
    marginBottom: 12,
    fontWeight: "500",
  },
  challengeProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  challengeProgressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  challengeProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    marginLeft: 12,
    overflow: "hidden",
  },
  challengeProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  goalCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  goalCardGradient: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  goalIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  goalAmount: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  goalRemaining: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
  },
  goalProgress: {
    alignItems: "flex-end",
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  goalDetails: {
    gap: 8,
    marginBottom: 16,
  },
  goalDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalDetailText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
  },
  goalActions: {
    justifyContent: "center",
  },
  contributeButton: {
    width: "100%",
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    padding: 14,
  },
  contributeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 6,
  },
  viewAllButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  viewAllGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 8,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    width: (width - 64) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  categoryGradient: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: "#6B7280",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    margin: 20,
    maxHeight: "85%",
    width: "90%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  modalBody: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    color: "#111827",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  categorySelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categorySelectorItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginBottom: 8,
    backgroundColor: "#F9FAFB",
  },
  categorySelectorItemActive: {
    borderColor: "transparent",
  },
  categorySelectorGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 20,
  },
  categorySelectorText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
  },
  categorySelectorTextActive: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  createGoalButton: {
    margin: 24,
    borderRadius: 16,
    overflow: "hidden",
  },
  createGoalGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  createGoalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
