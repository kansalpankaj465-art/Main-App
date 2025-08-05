import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import PSBColors from "../../constants/colors";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "scan"
    | "danger"
    | "warning"
    | "safe";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

export function Button({
  children,
  onPress,
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const tap = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(0.8, { duration: 100 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 100 });
    });

  const getButtonStyle = () => {
    const baseStyle = [styles.button];

    switch (variant) {
      case "destructive":
        baseStyle.push(styles.destructive);
        break;
      case "outline":
        baseStyle.push(styles.outline);
        break;
      case "secondary":
        baseStyle.push(styles.secondary);
        break;
      case "ghost":
        baseStyle.push(styles.ghost);
        break;

      case "scan":
        baseStyle.push(styles.scan);
        break;
      case "danger":
        baseStyle.push(styles.danger);
        break;
      case "warning":
        baseStyle.push(styles.warning);
        break;
      case "safe":
        baseStyle.push(styles.safe);
        break;
      default:
        baseStyle.push(styles.default);
    }

    switch (size) {
      case "sm":
        baseStyle.push(styles.sm);
        break;
      case "lg":
        baseStyle.push(styles.lg);
        break;
      case "icon":
        baseStyle.push(styles.icon);
        break;
      default:
        baseStyle.push(styles.defaultSize);
    }

    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text];

    switch (variant) {
      case "outline":
        baseStyle.push({ ...styles.text, ...styles.outlineText });
        break;
      case "ghost":
        baseStyle.push({ ...styles.text, ...styles.ghostText });
        break;
      default:
        baseStyle.push({ ...styles.text, ...styles.defaultText });
    }

    switch (size) {
      case "sm":
        baseStyle.push({ ...styles.text, ...styles.smText });
        break;
      case "lg":
        baseStyle.push({ ...styles.text, ...styles.lgText });
        break;
    }

    return baseStyle;
  };

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={tap}>
        <AnimatedTouchable
          onPress={onPress}
          disabled={disabled || loading}
          style={[animatedStyle, ...getButtonStyle(), style]}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={getTextStyle()}>{children}</Text>
          )}
        </AnimatedTouchable>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  default: {
    backgroundColor: PSBColors.primary,
    shadowColor: PSBColors.primary,
  },
  destructive: {
    backgroundColor: PSBColors.error,
    shadowColor: PSBColors.error,
  },
  outline: {
    borderWidth: 2,
    borderColor: PSBColors.primary,
    backgroundColor: "transparent",
    shadowOpacity: 0.1,
  },
  secondary: {
    backgroundColor: PSBColors.secondary,
    shadowColor: PSBColors.secondary,
  },
  ghost: {
    backgroundColor: "transparent",
    shadowOpacity: 0,
  },
  scan: {
    backgroundColor: PSBColors.primary,
    shadowColor: PSBColors.primary,
  },
  danger: {
    backgroundColor: PSBColors.error,
    shadowColor: PSBColors.error,
  },
  warning: {
    backgroundColor: PSBColors.warning,
    shadowColor: PSBColors.warning,
  },
  safe: {
    backgroundColor: PSBColors.success,
    shadowColor: PSBColors.success,
  },
  defaultSize: {
    paddingHorizontal: 24,
    paddingVertical: 18,
    minHeight: 48,
  },
  sm: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 40,
  },
  lg: {
    paddingHorizontal: 32,
    paddingVertical: 22,
    minHeight: 56,
  },
  icon: {
    padding: 12,
    minHeight: 48,
    minWidth: 48,
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  text: {
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  defaultText: {
    color: "#ffffff",
    fontSize: 16,
  },
  outlineText: {
    color: PSBColors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  ghostText: {
    color: PSBColors.primary,
    fontSize: 16,
  },
  smText: {
    fontSize: 14,
  },
  lgText: {
    fontSize: 18,
    fontWeight: "800",
  },
});
