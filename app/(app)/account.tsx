// app/(app)/account.tsx
import Account from "@/features/account/screens/Account";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function AccountScreen() {
  const { session, loading } = useAuth();

  // While session is restoring, render nothing (or your spinner)
  if (loading) return null;

  if (!session) return null;

  return (
    <>
      <Stack.Screen options={{ title: "Account" }} />
      <View className="flex-1">
        <Account key={session.user.id} session={session} />
      </View>
    </>
  );
}
