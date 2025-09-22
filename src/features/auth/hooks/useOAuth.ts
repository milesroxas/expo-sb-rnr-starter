import { signInWithOAuth } from "@/features/auth/services/auth.api";
import * as Linking from "expo-linking";
import { useCallback, useState } from "react";
import { OAuthProvider } from "../types";

type Provider = "oauth_apple" | "oauth_google" | "oauth_github" | (string & {});

export function useOAuth() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const signIn = useCallback(async (provider: Provider) => {
    setPending(true);
    setError(null);
    try {
      const url = await signInWithOAuth(provider as OAuthProvider);
      await Linking.openURL(url);
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setPending(false);
    }
  }, []);

  return { signIn, pending, error };
}
