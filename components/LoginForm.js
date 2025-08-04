import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/services/operations/authServices";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // for icons
import Toast from "react-native-toast-message";
import OAuthButtons from "./OAuthButtons";
import PSBColors from "../constants/colors";

const LoginForm = ({ onSwitchToSignup, onForgotPassword, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth?.loading);
  const token = useSelector((state) => state.auth?.token);
  
  // Handle login success when token changes
  useEffect(() => {
    if (token) {
      // Import router dynamically to avoid circular dependencies
      import("expo-router").then(({ router }) => {
        router.push('/(app)/(tabs)');
      });
    }
  }, [token]);

  return (
    <View style={styles.container}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>Secure Login</Text>
        <Text style={styles.formSubtitle}>Access your PSB digital banking</Text>
      </View>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color={PSBColors.primary} />
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color={PSBColors.primary} />
        <TextInput
          style={styles.input}
          placeholder="Enter your Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={PSBColors.gray[500]}
          />
        </TouchableOpacity>
      </View>

      {/* Remember me */}
      <View style={styles.row}>
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
            onPress={() => setRememberMe(!rememberMe)}
          >
            {rememberMe && <Ionicons name="checkmark" size={16} color={PSBColors.white} />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Remember me</Text>
        </View>
        <Text style={styles.link} onPress={onForgotPassword}>
          Forgot password?
        </Text>
      </View>

      {/* Sign in */}
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          if (!email) {
            Toast.show({ type: "error", text1: "Enter your email!" });
            return;
          }
          if (!password) {
            Toast.show({ type: "error", text1: "Enter your password!" });
            return;
          }
          // Add email format validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            Toast.show({
              type: "error",
              text1: "Enter a valid email address!",
            });
            return;
          }
          if (password.length < 6) {
            Toast.show({
              type: "error",
              text1: "Password must be at least 6 characters!",
            });
            return;
          }
          console.log("[LOGIN] Dispatching login with:", { email, password });
          const response = await dispatch(login(email, password));
          
          // Handle specific error cases
          if (response?.error) {
            const errorMessage = response.error.toLowerCase();
            
            // If user doesn't exist, suggest signup
            if (errorMessage.includes("user not found") || errorMessage.includes("no user") || errorMessage.includes("doesn't exist")) {
              Toast.show({
                type: "error",
                text1: "User not found",
                text2: "Please sign up first",
                onPress: () => onSwitchToSignup()
              });
            }
            // If password is incorrect
            else if (errorMessage.includes("incorrect password") || errorMessage.includes("invalid password") || errorMessage.includes("wrong password")) {
              Toast.show({
                type: "error",
                text1: "Incorrect password",
                text2: "Please try again or reset your password",
                onPress: () => onForgotPassword()
              });
            }
            // Other errors are already handled by the Toast in the login function
          }
          // After login, onLoginSuccess will be called in useEffect when token changes
        }}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        Don't have an account?{" "}
        <Text style={styles.link} onPress={onSwitchToSignup}>
          Sign Up
        </Text>
      </Text>

      <Text style={styles.orText}>Or With</Text>

      {/* Social buttons */}
      <OAuthButtons />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: PSBColors.white,
    padding: 30,
    borderRadius: 20,
    width: "90%",
    alignSelf: "center",
    marginTop: 50,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    borderTopWidth: 4,
    borderTopColor: PSBColors.primary,
  },
  formHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: PSBColors.primary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: 16,
    color: PSBColors.text.secondary,
    fontWeight: "500",
  },
  label: {
    fontWeight: "700",
    color: PSBColors.text.primary,
    marginBottom: 5,
    fontSize: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: PSBColors.card.border,
    borderWidth: 2,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: PSBColors.gray[50],
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: PSBColors.text.primary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2.5,
    borderColor: PSBColors.card.border,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: PSBColors.primary,
    borderColor: PSBColors.primary,
  },
  checkboxLabel: {
    marginLeft: 5,
    fontSize: 14,
    color: PSBColors.text.primary,
    fontWeight: "500",
  },
  link: {
    color: PSBColors.primary,
    fontWeight: "700",
  },
  button: {
    backgroundColor: PSBColors.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    shadowColor: PSBColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: PSBColors.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  signupText: {
    textAlign: "center",
    fontSize: 14,
    marginVertical: 5,
    color: PSBColors.text.primary,
    fontWeight: "500",
  },
  orText: {
    textAlign: "center",
    fontSize: 14,
    marginVertical: 10,
    color: PSBColors.text.secondary,
    fontWeight: "600",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: PSBColors.card.border,
    borderWidth: 2,
    borderRadius: 12,
    height: 50,
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: PSBColors.white,
    shadowColor: PSBColors.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default LoginForm;
