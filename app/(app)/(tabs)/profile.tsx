import React, { useState, useEffect } from "react";
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
import {
  User,
  Trophy,
  Flag,
  BookOpen,
  Brain,
  Award,
  Bell,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  Shield,
  GraduationCap,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../contexts/AuthContext";
import { setUser } from "../../../redux/slices/profileSlices";
import { router } from "expo-router";
import * as Animatable from "react-native-animatable";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { signOut } = useAuth();
  const userProfile = useSelector((state) => state.profile?.user);
  const [userData, setUserData] = useState(null);

  const progress = useSharedValue(0);

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

  const progressPercentage =
    (userStats.experiencePoints / userStats.nextLevelXP) * 100;

  useEffect(() => {
    progress.value = withTiming(progressPercentage, { duration: 800 });
  }, [progressPercentage]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    return { width: `${progress.value}%` };
  });

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
            dispatch(setUser(null));
            await signOut();
          } catch (error) {
            console.error("Error during logout:", error);
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <LinearGradient colors={["#FFFFFF", "#f8f9fa"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
            <Animatable.View
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite"
              style={styles.avatarContainer}
            >
              {userData?.avatar ? (
                <Image
                  source={{ uri: userData.avatar }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <LinearGradient
                  colors={["#00563F", "#007f5f"]}
                  style={styles.avatar}
                >
                  <User size={40} color="white" />
                </LinearGradient>
              )}
            </Animatable.View>
            <Text style={styles.userName}>
              {userData
                ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
                : "Fraud Fighter"}
            </Text>
            <Text style={styles.userLevel}>{userStats.currentLevel}</Text>
          </Animatable.View>

          {/* Progress Section */}
          <Animatable.View animation="fadeInUp" delay={200} duration={600} style={styles.sectionWrapper}>
            <View style={styles.sectionTitleContainer}>
              <Award size={20} color="#00563F" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Progress</Text>
            </View>
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
                <Animated.View style={[styles.progressFill, animatedProgressStyle]} />
              </View>
              <Text style={styles.progressLabel}>
                {userStats.nextLevelXP - userStats.experiencePoints} XP to next
                level
              </Text>
            </View>
          </Animatable.View>

          {/* Stats Section */}
          <Animatable.View animation="fadeInUp" delay={300} duration={600} style={styles.sectionWrapper}>
            <View style={styles.sectionTitleContainer}>
              <Brain size={20} color="#00563F" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Your Stats</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Flag size={24} color="#ff6b6b" />
                <Text style={styles.statValue}>{userStats.schemesExposed}</Text>
                <Text style={styles.statLabel}>Schemes Exposed</Text>
              </View>
              <View style={styles.statCard}>
                <Shield size={24} color="#4ecdc4" />
                <Text style={styles.statValue}>{userStats.redFlagsSpotted}</Text>
                <Text style={styles.statLabel}>Red Flags Spotted</Text>
              </View>
              <View style={styles.statCard}>
                <BookOpen size={24} color="#45b7d1" />
                <Text style={styles.statValue}>{userStats.storiesCompleted}</Text>
                <Text style={styles.statLabel}>Stories Completed</Text>
              </View>
              <View style={styles.statCard}>
                <Trophy size={24} color="#ffd93d" />
                <Text style={styles.statValue}>{userStats.badgesEarned}</Text>
                <Text style={styles.statLabel}>Badges Earned</Text>
              </View>
            </View>
          </Animatable.View>

          {/* Badges Section */}
          <Animatable.View animation="fadeInUp" delay={400} duration={600} style={styles.sectionWrapper}>
            <View style={styles.sectionTitleContainer}>
              <Award size={20} color="#00563F" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Badges Collection</Text>
            </View>
            <View style={styles.badgesGrid}>
              {badges.map((badge, index) => (
                <Animatable.View
                  key={index}
                  animation="bounceIn"
                  delay={index * 100}
                  style={[styles.badgeCard, !badge.earned && styles.badgeCardLocked]}
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
                </Animatable.View>
              ))}
            </View>
          </Animatable.View>

          {/* Recent Achievements */}
          <Animatable.View animation="fadeInUp" delay={500} duration={600} style={styles.sectionWrapper}>
            <View style={styles.sectionTitleContainer}>
              <Trophy size={20} color="#00563F" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Recent Achievements</Text>
            </View>
            {achievements.map((achievement, index) => (
              <Animatable.View
                key={index}
                animation="fadeInRight"
                delay={index * 200}
                style={styles.achievementCard}
              >
                <Trophy size={24} color="#ffd93d" />
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  <Text style={styles.achievementDate}>{achievement.date}</Text>
                </View>
              </Animatable.View>
            ))}
          </Animatable.View>

          {/* Settings Section */}
          <Animatable.View animation="fadeInUp" delay={600} duration={600} style={styles.sectionWrapper}>
            <View style={styles.sectionTitleContainer}>
              <Info size={20} color="#00563F" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Settings</Text>
            </View>

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
              <Text style={[styles.settingText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#00563F",
    borderBottomWidth: 4,
    borderBottomColor: "#FFD700",
  },
  avatarContainer: { marginBottom: 15 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFD70020",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 5,
  },
  userLevel: { fontSize: 16, color: "#FFFFFF", fontWeight: "600" },
  sectionWrapper: { paddingHorizontal: 20, marginBottom: 30 },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 15,
  },
  sectionIcon: { marginRight: 10 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00563F",
  },
  progressCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressText: { fontSize: 16, color: "#00563F", fontWeight: "600" },
  progressPercentage: { fontSize: 16, color: "#FFD700", fontWeight: "bold" },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e5e5",
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#00563F",
    borderRadius: 4,
  },
  progressLabel: { fontSize: 14, color: "#666666", textAlign: "center" },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  statValue: { fontSize: 24, fontWeight: "bold", color: "#00563F", marginTop: 8 },
  statLabel: { fontSize: 12, color: "#888888", textAlign: "center", marginTop: 4 },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badgeCard: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  badgeCardLocked: { opacity: 0.5 },
  badgeIconText: { fontSize: 24, color: "#00563F" },
  badgeName: {
    fontSize: 12,
    color: "#00563F",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
  },
  badgeNameLocked: { color: "#999999" },
  achievementCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  achievementContent: { flex: 1, marginLeft: 15 },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00563F",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 18,
    marginBottom: 4,
  },
  achievementDate: { fontSize: 12, color: "#999999" },
  settingItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "#00563F",
    marginLeft: 15,
    fontWeight: "500",
  },
  chevron: { fontSize: 24, color: "#999999" },
  logoutItem: { marginTop: 10 },
  logoutText: { color: "#ff6b6b" },
});

export default ProfileScreen;
