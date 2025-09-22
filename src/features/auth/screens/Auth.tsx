import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, AppState, AppStateStatus, Platform, View } from "react-native";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Button, Input, Label, Text } from "@/components/ui";

import { SOCIAL_CONNECTION_STRATEGIES } from "@/features/auth/config/providers";
import {
  sendMagicLink,
  signInWithPassword,
  signUpWithPassword,
} from "@/features/auth/services/auth.api";
import { supabase } from "@/lib/supabase";

import * as AppleAuthentication from "expo-apple-authentication";

import { useAppleSignIn } from "@/features/auth/hooks/useAppleSignIn";
import { useOAuth } from "@/features/auth/hooks/useOAuth";

/**
 * Discriminated union props
 * - On "signin": magic link allowed by default, but can be overridden
 * - On "signup": magic link disabled at the type level
 */
type SignInProps = {
  mode: "signin";
  showOAuth?: boolean;
  showMagicLink?: boolean; // default true on signin
};

type SignUpProps = {
  mode: "signup";
  showOAuth?: boolean;
  showMagicLink?: false; // can only be false on signup
};

type Props = SignInProps | SignUpProps;

export default function Auth(props: Props) {
  const { colorScheme } = useColorScheme();
  const { signIn: signInWithAppleNative, pending: applePending } =
    useAppleSignIn();
  const { signIn: signInWithProvider, pending: oauthPending } = useOAuth();
  const { mode, showOAuth = true } = props;

  const magicLinkEnabled =
    mode === "signin" ? (props.showMagicLink ?? true) : false;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);
  const isBusy = loading || applePending || oauthPending;

  // Check Apple Authentication availability
  useEffect(() => {
    if (Platform.OS === "ios") {
      AppleAuthentication.isAvailableAsync().then(setAppleAuthAvailable);
    }
  }, []);

  // Supabase token auto-refresh tied to foreground
  useEffect(() => {
    const onChange = (state: AppStateStatus) => {
      if (state === "active") supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    };
    const sub = AppState.addEventListener("change", onChange);
    onChange(AppState.currentState);
    return () => sub.remove();
  }, []);

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);

  const requirePassword = mode === "signup" || password.length > 0;

  const canSubmitPw = useMemo(
    () => emailValid && requirePassword && !isBusy,
    [emailValid, requirePassword, isBusy]
  );

  const canSubmitMagic = useMemo(
    () => magicLinkEnabled && emailValid && !isBusy,
    [magicLinkEnabled, emailValid, isBusy]
  );

  const handlePrimary = useCallback(async () => {
    if (!canSubmitPw) return;

    try {
      setLoading(true);
      if (mode === "signin") {
        await signInWithPassword(email.trim(), password);
      } else {
        const user = await signUpWithPassword(email.trim(), password);
        if (!user) {
          Alert.alert("Please check your inbox to verify your email.");
        }
      }
    } catch (err: any) {
      Alert.alert(
        err?.message ??
          (mode === "signin" ? "Unable to sign in" : "Unable to sign up")
      );
    } finally {
      setLoading(false);
    }
  }, [canSubmitPw, email, password, mode]);

  const handleMagicLink = useCallback(async () => {
    if (!canSubmitMagic) return;
    try {
      setLoading(true);
      await sendMagicLink(email.trim());
      Alert.alert("Check your inbox for a magic link to continue.");
    } catch (err: any) {
      Alert.alert(err?.message ?? "Unable to send magic link");
    } finally {
      setLoading(false);
    }
  }, [canSubmitMagic, email]);

  const handleOAuth = useCallback(
    async (provider: (typeof SOCIAL_CONNECTION_STRATEGIES)[number]["type"]) => {
      if (isBusy) return;
      try {
        setLoading(true);

        // Native Apple on iOS
        if (Platform.OS === "ios" && provider === "apple") {
          await signInWithAppleNative();
          return;
        }

        // Fallback for all providers including Apple on Android/web
        await signInWithProvider(provider);
      } catch (err: any) {
        Alert.alert(err?.message ?? "OAuth sign-in failed");
      } finally {
        setLoading(false);
      }
    },
    [isBusy, signInWithAppleNative, signInWithProvider]
  );

  return (
    <View className="p-6 pt-12">
      <Card className="shadow-none border-border/0 sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-xl text-center sm:text-left">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            {mode === "signin"
              ? "Sign in to continue."
              : "Sign up to get started."}
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
                accessibilityLabel="Email"
              />
            </View>

            <View className="gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                returnKeyType="send"
                accessibilityLabel="Password"
              />
            </View>

            <View className="gap-3">
              <Button
                className="w-full"
                disabled={!canSubmitPw}
                onPress={handlePrimary}
              >
                <Text>
                  {loading
                    ? mode === "signin"
                      ? "Signing in..."
                      : "Signing up..."
                    : mode === "signin"
                      ? "Sign in"
                      : "Sign up"}
                </Text>
              </Button>

              {magicLinkEnabled && (
                <Button
                  variant="ghost"
                  className="w-full"
                  disabled={!canSubmitMagic}
                  onPress={handleMagicLink}
                >
                  <Text>{loading ? "Sending..." : "Send Magic Link"}</Text>
                </Button>
              )}
            </View>

            {showOAuth && (
              <View className="gap-3 mt-6">
                {/* Apple on iOS -> native button per Supabase docs */}
                {Platform.OS === "ios" && appleAuthAvailable && (
                  <AppleAuthentication.AppleAuthenticationButton
                    buttonType={
                      AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                    }
                    buttonStyle={
                      colorScheme === "dark"
                        ? AppleAuthentication.AppleAuthenticationButtonStyle
                            .WHITE
                        : AppleAuthentication.AppleAuthenticationButtonStyle
                            .BLACK
                    }
                    cornerRadius={5}
                    style={{ width: "100%", height: 48 }}
                    onPress={async () => {
                      if (isBusy) return;
                      try {
                        setLoading(true);
                        await signInWithAppleNative();
                      } catch (e: any) {
                        if (e?.code !== "ERR_REQUEST_CANCELED") {
                          Alert.alert(e?.message ?? "Apple sign-in failed");
                        }
                      } finally {
                        setLoading(false);
                      }
                    }}
                  />
                )}

                {/* All other providers + Apple on Android/web -> OAuth fallback */}
                {SOCIAL_CONNECTION_STRATEGIES.filter(
                  (p) =>
                    !(
                      Platform.OS === "ios" &&
                      appleAuthAvailable &&
                      p.type === "apple"
                    )
                ).map((provider) => (
                  <Button
                    key={provider.type}
                    variant="outline"
                    className="flex flex-row gap-2 items-center w-full"
                    disabled={isBusy}
                    onPress={() => handleOAuth(provider.type)}
                    accessibilityLabel={`Continue with ${provider.type}`}
                  >
                    <View className="flex-row gap-2 items-center">
                      <Text>{`Continue with ${provider.type}`}</Text>
                    </View>
                  </Button>
                ))}
              </View>
            )}

            <View className="items-center mt-4">
              {mode === "signin" ? (
                <Text>
                  Do not have an account?{" "}
                  <Link href="/(auth)/sign-up">
                    <Text className="underline">Create one</Text>
                  </Link>
                </Text>
              ) : (
                <Text>
                  Already have an account?{" "}
                  <Link href="/(auth)">
                    <Text className="underline">Sign in</Text>
                  </Link>
                </Text>
              )}
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
