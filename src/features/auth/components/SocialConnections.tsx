// features/auth/components/SocialConnections.tsx
import { Button } from "@/components/ui/button";
import { SOCIAL_CONNECTION_STRATEGIES } from "@/features/auth/config/providers";
import { cn } from "@/lib/cn";
import { useColorScheme } from "nativewind";
import { Image, Platform, View } from "react-native";

type Strategy = (typeof SOCIAL_CONNECTION_STRATEGIES)[number];

export type SocialConnectionsProps = {
  disabled?: boolean;
  onPress: (provider: Strategy["type"]) => void;
  strategies?: Strategy[]; // optional override; defaults to config
};

export function SocialConnections({
  disabled,
  onPress,
  strategies = SOCIAL_CONNECTION_STRATEGIES,
}: SocialConnectionsProps) {
  const { colorScheme } = useColorScheme();

  return (
    <View className="gap-2 sm:flex-row sm:gap-3">
      {strategies.map((strategy) => (
        <Button
          key={strategy.type}
          variant="outline"
          size="sm"
          className="sm:flex-1"
          disabled={disabled}
          onPress={() => onPress(strategy.type)}
          accessibilityLabel={`Continue with ${strategy.type}`}
          testID={`oauth-${strategy.type}`}
        >
          <Image
            className={cn(
              "size-4",
              strategy.useTint && Platform.select({ web: "dark:invert" })
            )}
            tintColor={Platform.select({
              native: strategy.useTint
                ? colorScheme === "dark"
                  ? "white"
                  : "black"
                : undefined,
            })}
            source={strategy.source}
          />
        </Button>
      ))}
    </View>
  );
}
