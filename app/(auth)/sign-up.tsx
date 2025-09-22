import { Stack } from "expo-router";
import { View } from "react-native";

import Auth from "@/features/auth/screens/Auth";

export default function SignUpScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Create account" }} />
      <View className="flex-1">
        <Auth mode="signup" />
      </View>
    </>
  );
}
