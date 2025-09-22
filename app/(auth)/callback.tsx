import * as Linking from "expo-linking";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackScreen() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (!initialUrl) throw new Error("No callback URL found");

        const parsed = Linking.parse(initialUrl);
        const params = (parsed.queryParams ?? {}) as Record<string, string>;
        const code = params["code"];

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          const access_token = params["access_token"] as string | undefined;
          const refresh_token = params["refresh_token"] as string | undefined;
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (error) throw error;
          } else {
            throw new Error("Missing auth parameters in callback URL");
          }
        }

        if (isMounted) router.replace("/(app)/account");
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err instanceof Error ? err.message : String(err));
          router.replace("/(auth)");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "Signing in..." }} />
      <View className="flex-1 justify-center items-center p-6">
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text>{errorMessage ?? "Redirecting..."}</Text>
        )}
      </View>
    </>
  );
}
