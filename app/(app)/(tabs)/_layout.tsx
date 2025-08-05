import { Tabs } from "expo-router";
import { Chrome as Home, Brain, BookOpen, User, Wrench } from "lucide-react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import PSBColors from "../../../constants/colors";

export default function TabLayout() {
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTopColor: PSBColors.card.border,
          height: 75,
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: PSBColors.card.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 12,
          borderTopWidth: 2,
          borderTopColor: PSBColors.secondary,
        },
        tabBarActiveTintColor: PSBColors.primary,
        tabBarInactiveTintColor: PSBColors.gray[500],
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "700",
          letterSpacing: 0.3,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="tools"
        options={{
          title: "Tools",
          tabBarIcon: ({ size, color }) => <Wrench size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="simulator"
        options={{
          title: "Simulators",
          tabBarIcon: ({ size, color }) => <Brain size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: "Learn",
          tabBarIcon: ({ size, color }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
