import { supabase } from "@/lib/supabase";

/**
 * Input for password-based login
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Input for password-based sign-up
 * Extend with additional onboarding fields as needed
 */
export interface SignUpCredentials {
  email: string;
  password: string;
  username?: string;
}

/**
 * Input for passwordless (magic link) flow
 */
export interface MagicLinkCredentials {
  email: string;
  username?: string; // optional metadata if you want to store it
}

/**
 * Normalized error shape for authentication flows
 * Keeps UI code independent of Supabase error objects
 */
export interface AuthError {
  message: string;
  code?: string;
  status?: number;
  name?: string;
}

/**
 * Supported OAuth providers
 * Can be narrowed to actual usage or inferred from Supabase SDK
 */

/**
 * Matches exactly the provider strings Supabase supports
 */
export type OAuthProvider = Parameters<
  typeof supabase.auth.signInWithOAuth
>[0]["provider"];
