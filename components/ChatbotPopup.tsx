import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Animated,
} from "react-native";
import { WebView } from "react-native-webview";
import PSBColors from "../constants/colors";

const { width, height } = Dimensions.get("window");

interface ChatbotPopupProps {
  visible: boolean;
  onClose: () => void;
}

const ChatbotPopup: React.FC<ChatbotPopupProps> = ({ visible, onClose }) => {
  const slideAnim = React.useRef(new Animated.Value(width)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.popupContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>PSB Assistant</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Chatbot */}
          <WebView
            source={{
              uri: "https://www.chatbase.co/chatbot-iframe/HfkB8AwS8RkSfjW84TkZB",
            }}
            style={styles.webView}
            javaScriptEnabled
            domStorageEnabled
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  popupContainer: {
    width: width * 0.75,
    height: height * 0.68,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    marginRight: 32, // ✅ Added space from the right
    marginBottom:16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: -4, height: 4 },
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 2,
    borderColor: PSBColors.secondary,
  },
  header: {
    backgroundColor: PSBColors.primary,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: PSBColors.white,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  closeButton: {
    color: PSBColors.white,
    fontSize: 24,
    fontWeight: "bold",
  },
  webView: {
    flex: 1,
  },
});

export default ChatbotPopup;
