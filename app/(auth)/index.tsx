import { Stack } from "expo-router";
import { View } from "react-native";

import Auth from "@/features/auth/screens/Auth";

export default function AuthIndex() {
  return (
    <>
      <Stack.Screen options={{ title: "Sign in" }} />
      <View className="flex-1">
        <Auth mode="signin" />
      </View>
    </>
  );
}
