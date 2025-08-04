import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import PSBColors from "../../constants/colors";

interface CardProps {
  children: React.ReactNode;
  style?: any;
  animated?: boolean;
  delay?: number;
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: any;
}

interface CardTitleProps {
  children: React.ReactNode;
  style?: any;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  style?: any;
}

interface CardContentProps {
  children: React.ReactNode;
  style?: any;
}

export function Card({
  children,
  style,
  animated = false,
  delay = 0,
}: CardProps) {
  if (animated) {
    return (
      <Animated.View
        entering={FadeInUp.delay(delay).springify()}
        style={[styles.card, style]}
      >
        {children}
      </Animated.View>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return <View style={[styles.header, style]}>{children}</View>;
}

export function CardTitle({ children, style }: CardTitleProps) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function CardDescription({ children, style }: CardDescriptionProps) {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

export function CardContent({ children, style }: CardContentProps) {
  return <View style={[styles.content, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PSBColors.card.border,
    backgroundColor: PSBColors.card.background,
    padding: 24,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: "column",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: PSBColors.text.primary,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 16,
    color: PSBColors.text.secondary,
    lineHeight: 24,
  },
  content: {
    paddingTop: 0,
  },
});
