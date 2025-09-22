import { Button, Text } from "@/components/ui";
import { router } from "expo-router";
import { View } from "react-native";

export default function AppIndex() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text>Welcome to the app!</Text>
      <Button onPress={() => router.push("/(app)/account")}>
        <Text>Go to account</Text>
      </Button>
    </View>
  );
}
