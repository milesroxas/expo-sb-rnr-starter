import type { OAuthProvider } from "../types";

export interface SocialConnectionStrategy {
  type: OAuthProvider;
  source: { uri: string };
  useTint: boolean;
}

/**
 * Config for rendering social login buttons.
 * Icons can be swapped without touching auth logic.
 */
export const SOCIAL_CONNECTION_STRATEGIES: SocialConnectionStrategy[] = [
  {
    type: "apple",
    source: { uri: "https://img.clerk.com/static/apple.png?width=160" },
    useTint: true,
  },
  {
    type: "google",
    source: { uri: "https://img.clerk.com/static/google.png?width=160" },
    useTint: false,
  },
  {
    type: "github",
    source: { uri: "https://img.clerk.com/static/github.png?width=160" },
    useTint: true,
  },
];
