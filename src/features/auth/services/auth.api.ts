// features/auth/services/auth.api.ts
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import type { AuthError, OAuthProvider } from "../types";

function getRedirectTo(): string {
  return Linking.createURL("/auth/callback");
}

function toAuthError(error: unknown): AuthError {
  if (error && typeof error === "object" && "message" in error) {
    const e = error as { message?: string; code?: string; status?: number };
    return {
      message: e.message ?? "Unknown authentication error",
      code: e.code,
      status: e.status,
    };
  }
  return { message: "Unknown authentication error" };
}

/**
 * Password-based signup
 */
export async function signUpWithPassword(
  email: string,
  password: string,
  username?: string
): Promise<User> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: getRedirectTo(),
    },
  });
  if (error || !data.user) throw toAuthError(error);
  return data.user;
}

/**
 * Password-based login
 */
export async function signInWithPassword(
  email: string,
  password: string
): Promise<Session> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.session) throw toAuthError(error);
  return data.session;
}

/**
 * Send a passwordless magic link
 */
export async function sendMagicLink(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getRedirectTo(),
      shouldCreateUser: true, // or false if you only allow existing users
    },
  });
  if (error) throw toAuthError(error);
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw toAuthError(error);
}

/**
 * Social OAuth login
 */
export async function signInWithOAuth(
  provider: OAuthProvider
): Promise<string> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: getRedirectTo() },
  });
  if (error || !data.url) throw toAuthError(error);
  return data.url;
}
