import "@/styles/global.css";
import { LogBox } from "react-native";

import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";

import { ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { NAV_THEME } from "@/styles/theme";

LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <StatusBar
        key={`root-status-bar-${colorScheme ? "light" : "dark"}`}
        style={colorScheme ? "light" : "dark"}
      />
      <SafeAreaProvider>
        <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
          <AuthProvider>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="(public)" options={{ headerShown: false }} />
            </Stack>
            <PortalHost />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </>
  );
}
