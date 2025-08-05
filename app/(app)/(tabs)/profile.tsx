import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Trophy, Flag, BookOpen, Brain, Award, Bell, Globe, Circle as HelpCircle, Info, LogOut, Shield, GraduationCap } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../contexts/AuthContext";
import { setUser } from "../../../redux/slices/profileSlices";
import { router } from "expo-router";
import PSBColors from "../../../constants/colors";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { signOut } = useAuth();
  const userProfile = useSelector((state: any) => state.profile?.user);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    if (!userProfile) {
      loadUserData();
    } else {
      setUserData(userProfile);
    }
  }, [userProfile]);

  const userStats = {
    schemesExposed: 12,
    redFlagsSpotted: 45,
    storiesCompleted: 8,
    badgesEarned: 6,
    currentLevel: "Financial Detective",
    experiencePoints: 2450,
    nextLevelXP: 3000,
  };

  const badges = [
    { name: "Red Flag Spotter", icon: Flag, color: "#ff6b6b", earned: true },
    { name: "Collapse Survivor", icon: Shield, color: "#4ecdc4", earned: true },
    { name: "Financial Detective", icon: "🔍", color: "#45b7d1", earned: true },
    { name: "Story Master", icon: BookOpen, color: "#96ceb4", earned: true },
    { name: "Scheme Buster", icon: "⚖️", color: "#ffd93d", earned: true },
    { name: "Fraud Fighter", icon: "🛡️", color: "#ff9ff3", earned: true },
    { name: "Awareness Champion", icon: "📢", color: "#54a0ff", earned: false },
    {
      name: "Master Educator",
      icon: GraduationCap,
      color: "#5f27cd",
      earned: false,
    },
  ];

  const achievements = [
    {
      title: "First Simulation",
      description: "Completed your first Ponzi scheme simulation",
      date: "2024-01-15",
    },
    {
      title: "Red Flag Expert",
      description: "Spotted 50 red flags in the detection game",
      date: "2024-01-20",
    },
    {
      title: "Story Enthusiast",
      description: "Completed 10 story mode scenarios",
      date: "2024-01-25",
    },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            // Clear user state
            dispatch(setUser(null));

            // Use the auth context logout
            await signOut();
            // Navigation will be handled by AuthProvider
          } catch (error) {
            console.error("Error during logout:", error);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const progressPercentage =
    (userStats.experiencePoints / userStats.nextLevelXP) * 100;

  return (
    <LinearGradient colors={PSBColors.gradients.neutral} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.bankHeader}>
              <Text style={styles.bankName}>Punjab & Sind Bank</Text>
              <Text style={styles.bankTagline}>Personal Banking Profile</Text>
            </View>
            <View style={styles.avatarContainer}>
              {userData?.avatar ? (
                <Image
                  source={{ uri: userData.avatar }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <LinearGradient
                  colors={PSBColors.gradients.primary}
                  style={styles.avatar}
                >
                  <User size={40} color={PSBColors.white} />
                </LinearGradient>
              )}
            </View>
            <Text style={styles.userName}>
              {userData
                ? `${userData.firstName || ""} ${
                    userData.lastName || ""
                  }`.trim()
                : "Fraud Fighter"}
            </Text>
            <Text style={[styles.userLevel, { color: PSBColors.primary }]}>
              {userStats.currentLevel}
            </Text>
          </View>

          {/* Progress Section */}
          <View style={styles.progressContainer}>
            <Text style={styles.sectionTitle}>Progress</Text>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>
                  {userStats.experiencePoints} / {userStats.nextLevelXP} XP
                </Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(progressPercentage)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { 
                      width: `${progressPercentage}%`,
                      backgroundColor: PSBColors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressLabel}>
                {userStats.nextLevelXP - userStats.experiencePoints} XP to next
                level
              </Text>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Brain size={24} color="#ff6b6b" />
                <Text style={styles.statValue}>{userStats.schemesExposed}</Text>
                <Text style={styles.statLabel}>Schemes Exposed</Text>
              </View>
              <View style={styles.statCard}>
                <Flag size={24} color="#4ecdc4" />
                <Text style={styles.statValue}>
                  {userStats.redFlagsSpotted}
                </Text>
                <Text style={styles.statLabel}>Red Flags Spotted</Text>
              </View>
              <View style={styles.statCard}>
                <BookOpen size={24} color="#45b7d1" />
                <Text style={styles.statValue}>
                  {userStats.storiesCompleted}
                </Text>
                <Text style={styles.statLabel}>Stories Completed</Text>
              </View>
              <View style={styles.statCard}>
                <Trophy size={24} color="#ffd93d" />
                <Text style={styles.statValue}>{userStats.badgesEarned}</Text>
                <Text style={styles.statLabel}>Badges Earned</Text>
              </View>
            </View>
          </View>

          {/* Badges Section */}
          <View style={styles.badgesContainer}>
            <Text style={styles.sectionTitle}>Badges Collection</Text>
            <View style={styles.badgesGrid}>
              {badges.map((badge, index) => (
                <View
                  key={index}
                  style={[
                    styles.badgeCard,
                    !badge.earned && styles.badgeCardLocked,
                  ]}
                >
                  {typeof badge.icon === "string" ? (
                    <Text
                      style={[
                        styles.badgeIconText,
                        { color: badge.earned ? badge.color : "#666" },
                      ]}
                    >
                      {badge.icon}
                    </Text>
                  ) : (
                    <badge.icon
                      size={24}
                      color={badge.earned ? badge.color : "#666"}
                    />
                  )}
                  <Text
                    style={[
                      styles.badgeName,
                      !badge.earned && styles.badgeNameLocked,
                    ]}
                  >
                    {badge.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Achievements */}
          <View style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                <Trophy size={24} color="#ffd93d" />
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                  <Text style={styles.achievementDate}>{achievement.date}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Settings Section */}
          <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>Settings</Text>

            <TouchableOpacity style={styles.settingItem}>
              <Bell size={24} color="#4ecdc4" />
              <Text style={styles.settingText}>Notifications</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Globe size={24} color="#45b7d1" />
              <Text style={styles.settingText}>Language</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => router.push("/pages/LearnScreen")}
            >
              <HelpCircle size={24} color="#96ceb4" />
              <Text style={styles.settingText}>Help & Support</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Info size={24} color="#ffd93d" />
              <Text style={styles.settingText}>About</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingItem, styles.logoutItem]}
              onPress={handleLogout}
            >
              <LogOut size={24} color="#ff6b6b" />
              <Text style={[styles.settingText, styles.logoutText]}>
                Logout
              </Text>
            </TouchableOpacity>
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
  header: {
    alignItems: "center",
    paddingVertical: 30,
  },
  bankHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  bankTitleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bankName: {
    fontSize: 22,
    fontWeight: "800",
    color: PSBColors.primary,
    letterSpacing: -0.3,
  },
  bankNameUnderline: {
    width: 50,
    height: 2,
    backgroundColor: PSBColors.secondary,
    borderRadius: 1,
    marginTop: 4,
  },
  bankTagline: {
    fontSize: 14,
    color: PSBColors.text.secondary,
    fontWeight: "600",
    marginBottom: 8,
  },
  profileBadge: {
    backgroundColor: PSBColors.secondary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PSBColors.secondary + '40',
  },
  profileBadgeText: {
    color: PSBColors.brand.heritage,
    fontSize: 12,
    fontWeight: '700',
  },
  avatarContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarBorder: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: PSBColors.secondary,
    top: -5,
    left: -5,
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    color: PSBColors.text.primary,
    marginBottom: 5,
    letterSpacing: -0.5,
  },
  userLevel: {
    fontSize: 18,
    fontWeight: "700",
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: PSBColors.text.primary,
    marginBottom: 15,
  },
  progressCard: {
    backgroundColor: PSBColors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    color: PSBColors.text.primary,
    fontWeight: "600",
  },
  progressPercentage: {
    fontSize: 16,
    color: PSBColors.primary,
    fontWeight: "bold",
  },
  progressBar: {
    height: 8,
    backgroundColor: PSBColors.gray[200],
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 14,
    color: PSBColors.text.secondary,
    textAlign: "center",
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: PSBColors.white,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: PSBColors.text.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: PSBColors.text.secondary,
    textAlign: "center",
    marginTop: 4,
  },
  badgesContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badgeCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  badgeCardLocked: {
    opacity: 0.5,
  },
  badgeIconText: {
    fontSize: 24,
  },
  badgeName: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
  },
  badgeNameLocked: {
    color: "#666",
  },
  achievementsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  achievementCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  achievementContent: {
    flex: 1,
    marginLeft: 15,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: "#b8b8b8",
    lineHeight: 18,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: "#666",
  },
  settingsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  settingItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "white",
    marginLeft: 15,
    fontWeight: "500",
  },
  chevron: {
    fontSize: 24,
    color: "#b8b8b8",
  },
  logoutItem: {
    marginTop: 10,
  },
  logoutText: {
    color: "#ff6b6b",
  },
});

export default ProfileScreen;
