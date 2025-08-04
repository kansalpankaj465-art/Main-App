import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFrameworkReady } from "../hooks/useFrameworkReady";
import { ThemeProvider } from "../contexts/ThemeContext";
import { Provider } from "react-redux";
import { AuthProvider } from "../contexts/AuthContext";
import store from "../redux/store";
import Toast from "react-native-toast-message";

function MainLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <Slot />
          <StatusBar style="light" backgroundColor="#1a1a2e" />
          {/* ✅ Global Toast */}
          <Toast position="top" visibilityTime={3000} />
        </AuthProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <MainLayout />
    </Provider>
  );
}
