import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiConnector } from "../apiConnector";
import { authApi } from "../api";
import { setToken, setLoading } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlices";

// Sign up operation
export const signUp = (formData) => async (dispatch) => {
  dispatch(setLoading(true));
  
  try {
    console.log("🔐 Starting signup process...");
    
    const response = await apiConnector("POST", authApi.POST_SIGNUP_USER_API, formData);
    
    if (response.success) {
      const { token, user } = response.data;
      
      // Store token and user data
      await AsyncStorage.setItem("user_token", token);
      await AsyncStorage.setItem("user_profile", JSON.stringify(user));
      
      // Update Redux state
      dispatch(setToken(token));
      dispatch(setUser(user));
      
      console.log("✅ Signup successful");
      return { success: true, user };
    } else {
      throw new Error(response.error || "Signup failed");
    }
  } catch (error) {
    console.error("❌ Signup error:", error);
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Login operation
export const login = (formData) => async (dispatch) => {
  dispatch(setLoading(true));
  
  try {
    console.log("🔐 Starting login process...");
    
    const response = await apiConnector("POST", authApi.POST_LOGIN_USER_API, formData);
    
    if (response.success) {
      const { token, user } = response.data;
      
      // Store token and user data
      await AsyncStorage.setItem("user_token", token);
      await AsyncStorage.setItem("user_profile", JSON.stringify(user));
      
      // Update Redux state
      dispatch(setToken(token));
      dispatch(setUser(user));
      
      console.log("✅ Login successful");
      return { success: true, user };
    } else {
      throw new Error(response.error || "Login failed");
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Logout operation
export const logout = () => async (dispatch) => {
  try {
    console.log("🔐 Starting logout process...");
    
    // Call logout API (optional, for server-side cleanup)
    try {
      await apiConnector("POST", authApi.POST_LOGOUT_USER_API);
    } catch (error) {
      console.log("Logout API call failed, proceeding with local logout");
    }
    
    // Clear local storage
    await AsyncStorage.multiRemove(["user_token", "user_profile"]);
    
    // Clear Redux state
    dispatch(setToken(null));
    dispatch(setUser(null));
    
    console.log("✅ Logout successful");
    return { success: true };
  } catch (error) {
    console.error("❌ Logout error:", error);
    return { success: false, error: error.message };
  }
};

// Forgot password operation
export const forgotPassword = (email) => async (dispatch) => {
  dispatch(setLoading(true));
  
  try {
    console.log("🔐 Starting forgot password process...");
    
    const response = await apiConnector("POST", authApi.POST_FORGOT_PASSWORD_API, { email });
    
    if (response.success) {
      console.log("✅ Password reset token generated");
      return { 
        success: true, 
        message: "Password reset instructions sent to your email",
        resetToken: response.data.resetToken // For testing - in production this would be sent via email
      };
    } else {
      throw new Error(response.error || "Failed to send reset email");
    }
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Reset password operation
export const resetPassword = (resetToken, newPassword) => async (dispatch) => {
  dispatch(setLoading(true));
  
  try {
    console.log("🔐 Starting password reset process...");
    
    const response = await apiConnector("POST", authApi.POST_RESET_PASSWORD_API, {
      resetToken,
      newPassword
    });
    
    if (response.success) {
      console.log("✅ Password reset successful");
      return { success: true, message: "Password reset successful" };
    } else {
      throw new Error(response.error || "Password reset failed");
    }
  } catch (error) {
    console.error("❌ Reset password error:", error);
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Get current user operation
export const getCurrentUser = () => async (dispatch) => {
  try {
    console.log("🔐 Fetching current user...");
    
    const response = await apiConnector("GET", authApi.GET_CURRENT_USER_API);
    
    if (response.success) {
      const user = response.data.user;
      
      // Update user data in storage and Redux
      await AsyncStorage.setItem("user_profile", JSON.stringify(user));
      dispatch(setUser(user));
      
      console.log("✅ Current user fetched successfully");
      return { success: true, user };
    } else {
      throw new Error(response.error || "Failed to fetch user");
    }
  } catch (error) {
    console.error("❌ Get current user error:", error);
    return { success: false, error: error.message };
  }
};

// Update profile operation
export const updateProfile = (profileData) => async (dispatch) => {
  try {
    console.log("🔐 Updating user profile...");
    
    const response = await apiConnector("PUT", authApi.PUT_UPDATE_PROFILE_API, profileData);
    
    if (response.success) {
      const user = response.data.user;
      
      // Update user data in storage and Redux
      await AsyncStorage.setItem("user_profile", JSON.stringify(user));
      dispatch(setUser(user));
      
      console.log("✅ Profile updated successfully");
      return { success: true, user };
    } else {
      throw new Error(response.error || "Failed to update profile");
    }
  } catch (error) {
    console.error("❌ Update profile error:", error);
    return { success: false, error: error.message };
  }
};

// Check if user is authenticated
export const checkAuthStatus = () => async (dispatch) => {
  try {
    const token = await AsyncStorage.getItem("user_token");
    const userString = await AsyncStorage.getItem("user_profile");
    
    if (token && userString) {
      const user = JSON.parse(userString);
      
      // Set token and user in Redux
      dispatch(setToken(token));
      dispatch(setUser(user));
      
      // Optionally verify token with server
      try {
        await getCurrentUser()(dispatch);
      } catch (error) {
        console.log("Token verification failed, clearing auth state");
        await logout()(dispatch);
        return { success: false, error: "Token expired" };
      }
      
      return { success: true, user };
    }
    
    return { success: false, error: "No authentication data found" };
  } catch (error) {
    console.error("❌ Check auth status error:", error);
    return { success: false, error: error.message };
  }
};
