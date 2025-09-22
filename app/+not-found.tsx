import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFound() {
  return (
    <>
      <Stack.Screen
        options={{ title: "Not Found", headerTitle: "Not Found" }}
      />
      <View className="flex justify-center items-center h-full">
        <Text className="text-2xl font-bold">Not Found</Text>
        <Link href="/">Go to home</Link>
      </View>
    </>
  );
}
