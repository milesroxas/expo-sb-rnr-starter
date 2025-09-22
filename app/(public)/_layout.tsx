// app/(public)/_layout.tsx
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { Redirect, Slot } from "expo-router";

export default function PublicLayout() {
  const { session, loading } = useAuth();

  if (loading) return null;

  if (session) {
    // Redirect to a concrete route in (app)
    return <Redirect href="/(app)/account" />;
  }

  return <Slot />;
}
