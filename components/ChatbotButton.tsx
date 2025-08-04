import React, { useRef, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  ViewStyle,
} from "react-native";
import { MessageCircle } from "lucide-react-native";
import PSBColors from "../constants/colors";

interface ChatbotButtonProps {
  onPress: () => void;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onPress }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(100)).current; // Start off-screen

  useEffect(() => {
    // Floating button bounce animation
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();

    // Slide-up entry animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [pulseAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: pulseAnim }, { translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <MessageCircle color={PSBColors.white} size={24} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 36,
    right: 24,
    zIndex: 1000,
  } as ViewStyle,
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PSBColors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: PSBColors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 3,
    borderColor: PSBColors.white,
  },
});

export default ChatbotButton;
