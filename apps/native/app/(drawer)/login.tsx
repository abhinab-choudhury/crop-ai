import * as React from "react";
import { Image, View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import logo from "@/assets/icon.png";

export default function Login() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Card className="w-full max-w-sm rounded-2xl shadow-none border-none">
        <CardHeader className="items-center">
          <Image source={logo} className="w-16 h-16 mb-3" />
          <CardTitle className="text-xl font-semibold text-foreground">
            Welcome to Crop AI
          </CardTitle>
          <Text className="text-muted-foreground text-sm mt-1">
            Sign in to continue
          </Text>
        </CardHeader>

        <CardContent className="mt-4 space-y-3">
          <Button
            variant="outline"
            size="lg"
            className="flex flex-row items-center justify-center space-x-2 rounded-xl border-muted-foreground/20"
            onPress={() => {
              // TODO: Authenticate with social provider
            }}
          >
            <Image
              className="w-5 h-5"
              source={{
                uri: "https://img.clerk.com/static/google.png?width=160",
              }}
            />
            <Text className="text-foreground font-medium">
              Continue with Google
            </Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}
