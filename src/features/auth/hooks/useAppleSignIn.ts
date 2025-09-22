// features/auth/hooks/useAppleSignIn.ts
import { supabase } from "@/lib/supabase";
import * as AppleAuthentication from "expo-apple-authentication";

import { useCallback, useState } from "react";

export function useAppleSignIn() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const signIn = useCallback(async () => {
    setPending(true);
    setError(null);

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("No identityToken.");
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });
      if (error) throw error;

      // Optional: first-login capture
      // credential.fullName, credential.email
    } catch (e) {
      // Forward cancel errors to caller if you want to differentiate
      setError(e);
      throw e;
    } finally {
      setPending(false);
    }
  }, []);

  return { signIn, pending, error };
}
