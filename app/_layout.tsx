import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFrameworkReady } from "../hooks/useFrameworkReady";
import { ThemeProvider } from "../contexts/ThemeContext";
import { Provider } from "react-redux";
import { AuthProvider } from "../contexts/AuthContext";
import store from "../redux/store";
import PSBColors from "../constants/colors";

function MainLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <Slot />
          <StatusBar style="dark" backgroundColor={PSBColors.white} />
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
