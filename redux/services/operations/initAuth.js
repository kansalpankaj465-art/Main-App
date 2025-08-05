import AsyncStorage from "@react-native-async-storage/async-storage";
import { setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlices";
import { getCurrentUser } from "./authServices";

/**
 * Initialize authentication state from AsyncStorage
 * This function should be called when the app starts
 */
export const initializeAuth = () => async (dispatch) => {
  try {
    console.log("🔐 Initializing auth from AsyncStorage...");

    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem("user_token");
    console.log("Token from AsyncStorage:", token ? "Found" : "Not found");

    const userString = await AsyncStorage.getItem("user_profile");
    console.log("User data from AsyncStorage:", userString ? "Found" : "Not found");

    if (token) {
      console.log("✅ Token found, setting in Redux store");
      dispatch(setToken(token));

      // If we have user data, set it in Redux
      if (userString) {
        try {
          const user = JSON.parse(userString);
          console.log("✅ Setting user data in Redux store:", user.email);
          dispatch(setUser(user));

          // Verify token is still valid by fetching current user
          try {
            console.log("🔄 Verifying token validity...");
            const result = await dispatch(getCurrentUser());
            
            if (result.success) {
              console.log("✅ Token verified successfully");
              return { success: true, user: result.user };
            } else {
              console.log("❌ Token verification failed, clearing auth state");
              // Clear invalid auth data
              await AsyncStorage.multiRemove(["user_token", "user_profile"]);
              dispatch(setToken(null));
              dispatch(setUser(null));
              return { success: false, error: "Token expired" };
            }
          } catch (verificationError) {
            console.log("❌ Token verification error:", verificationError.message);
            // Clear invalid auth data
            await AsyncStorage.multiRemove(["user_token", "user_profile"]);
            dispatch(setToken(null));
            dispatch(setUser(null));
            return { success: false, error: "Token verification failed" };
          }
        } catch (parseError) {
          console.error("❌ Error parsing user data:", parseError);
          // Clear corrupted data
          await AsyncStorage.removeItem("user_profile");
          return { success: false, error: "Corrupted user data" };
        }
      } else {
        console.log("⚠️ Token found but no user data, fetching from server");
        
        try {
          const result = await dispatch(getCurrentUser());
          if (result.success) {
            console.log("✅ User data fetched successfully");
            return { success: true, user: result.user };
          } else {
            console.log("❌ Failed to fetch user data, clearing token");
            await AsyncStorage.removeItem("user_token");
            dispatch(setToken(null));
            return { success: false, error: "Failed to fetch user data" };
          }
        } catch (fetchError) {
          console.log("❌ Error fetching user data:", fetchError.message);
          await AsyncStorage.removeItem("user_token");
          dispatch(setToken(null));
          return { success: false, error: "Failed to fetch user data" };
        }
      }
    } else {
      console.log("ℹ️ No token found in AsyncStorage, user is not authenticated");
      return { success: false, error: "No authentication token found" };
    }
  } catch (error) {
    console.error("❌ Failed to initialize auth from AsyncStorage:", error);
    
    // Clear potentially corrupted data
    try {
      await AsyncStorage.multiRemove(["user_token", "user_profile"]);
      dispatch(setToken(null));
      dispatch(setUser(null));
    } catch (clearError) {
      console.error("❌ Error clearing auth data:", clearError);
    }
    
    return { success: false, error: "Failed to initialize auth" };
  }
};

/**
 * Helper function to check if user is authenticated
 */
export const checkAuthenticationStatus = () => async () => {
  try {
    const token = await AsyncStorage.getItem("user_token");
    const userString = await AsyncStorage.getItem("user_profile");
    
    return {
      isAuthenticated: !!(token && userString),
      hasToken: !!token,
      hasUserData: !!userString
    };
  } catch (error) {
    console.error("❌ Error checking auth status:", error);
    return {
      isAuthenticated: false,
      hasToken: false,
      hasUserData: false
    };
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => async (dispatch) => {
  try {
    console.log("🧹 Clearing all authentication data...");
    
    await AsyncStorage.multiRemove(["user_token", "user_profile"]);
    dispatch(setToken(null));
    dispatch(setUser(null));
    
    console.log("✅ Authentication data cleared successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Error clearing auth data:", error);
    return { success: false, error: error.message };
  }
};
