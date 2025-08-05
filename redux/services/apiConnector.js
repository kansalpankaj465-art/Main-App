import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = __DEV__ 
  ? "http://localhost:4000/api" 
  : "https://your-production-api.com/api";

// API Connector with JWT token support
export const apiConnector = async (method, url, bodyData = null, headers = {}) => {
  try {
    // Get JWT token from AsyncStorage
    const token = await AsyncStorage.getItem("user_token");
    
    // Prepare headers
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Add Authorization header if token exists
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    // Prepare request configuration
    const config = {
      method: method.toUpperCase(),
      headers: defaultHeaders,
    };

    // Add body for POST, PUT, PATCH requests
    if (bodyData && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      config.body = JSON.stringify(bodyData);
    }

    console.log(`🌐 API Request: ${method.toUpperCase()} ${url}`);
    console.log("📤 Request Body:", bodyData);

    // Make the request
    const response = await fetch(url, config);
    
    console.log(`📥 Response Status: ${response.status}`);
    
    // Parse response
    const responseData = await response.json();
    
    console.log("📥 Response Data:", responseData);

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      // Token expired or invalid, clear storage and redirect to login
      await AsyncStorage.multiRemove(["user_token", "user_profile"]);
      throw new Error("Authentication failed. Please login again.");
    }

    // Handle other errors
    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: responseData,
      status: response.status,
    };

  } catch (error) {
    console.error("❌ API Error:", error);
    return {
      success: false,
      error: error.message,
      status: error.status || 500,
    };
  }
};

// Helper function for GET requests
export const GET = (url, headers = {}) => apiConnector("GET", url, null, headers);

// Helper function for POST requests  
export const POST = (url, data, headers = {}) => apiConnector("POST", url, data, headers);

// Helper function for PUT requests
export const PUT = (url, data, headers = {}) => apiConnector("PUT", url, data, headers);

// Helper function for DELETE requests
export const DELETE = (url, headers = {}) => apiConnector("DELETE", url, null, headers);

// Helper function for PATCH requests
export const PATCH = (url, data, headers = {}) => apiConnector("PATCH", url, data, headers);
