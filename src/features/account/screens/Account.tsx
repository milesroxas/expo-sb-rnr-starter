import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (!session?.user) return;
    (async () => {
      try {
        setLoading(true);

        const { data, error, status } = await supabase
          .from("profiles")
          .select(`username, website, avatar_url`)
          .eq("id", session.user.id)
          .single();

        if (error && status !== 406) throw error;

        if (data) {
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [session?.user]);

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="p-6">
      <Card className="shadow-none border-border/0 sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-xl text-center sm:text-left">
            Account
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Manage your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={session?.user?.email || ""}
                editable={false}
              />
            </View>
            <View className="gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username || ""}
                onChangeText={(text) => setUsername(text)}
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>
            <View className="gap-1.5">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={website || ""}
                onChangeText={(text) => setWebsite(text)}
                autoCapitalize="none"
                returnKeyType="done"
              />
            </View>
            <View className="gap-3">
              <Button
                className="w-full"
                disabled={loading}
                onPress={() =>
                  updateProfile({ username, website, avatar_url: avatarUrl })
                }
              >
                <Text>{loading ? "Loading ..." : "Update"}</Text>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onPress={() => supabase.auth.signOut()}
              >
                <Text>Sign Out</Text>
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
