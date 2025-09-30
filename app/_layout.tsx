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
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://c993b67496005cf2368a92f96ea607e2@o4510105496584192.ingest.us.sentry.io/4510105587941376',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

export { ErrorBoundary } from "expo-router";

export default Sentry.wrap(function RootLayout() {
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
});