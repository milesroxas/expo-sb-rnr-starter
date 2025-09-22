// app/(app)/_layout.tsx
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { Redirect, Slot } from "expo-router";

export default function AppLayout() {
  const { session, loading } = useAuth();

  if (loading) return null;

  if (!session) {
    return <Redirect href="/(auth)/sign-up" />;
  }

  return <Slot />;
}
