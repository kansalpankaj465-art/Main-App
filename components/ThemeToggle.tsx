import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react-native";
import PSBColors from "../constants/colors";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.toggleButton,
        {
          backgroundColor: PSBColors.white,
          borderColor: PSBColors.card.border,
        },
      ]}
      onPress={toggleTheme}
    >
      <Text style={[styles.toggleText, { color: theme.colors.text }]}>
        {theme.isDark ? (
          <Moon size={24} color={PSBColors.primary} />
        ) : (
          <Sun size={24} color={PSBColors.secondary} />
        )}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 20,
  },
});

export default ThemeToggle;
