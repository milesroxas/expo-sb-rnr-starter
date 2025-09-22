import { useAuth } from "@/features/auth/providers/AuthProvider";
import { Redirect, Slot } from "expo-router";

export default function AuthLayout() {
  const { session, loading } = useAuth();

  if (loading) return null;

  // Already signed in → go to app
  if (session) {
    return <Redirect href="/(app)/account" />;
  }

  // Otherwise show auth routes (sign-in, sign-up, etc.)
  return <Slot />;
}
