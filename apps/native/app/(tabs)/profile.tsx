import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

export default function Profile() {

  return (
    <View className="flex-1 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="mb-2 text-base text-foreground">
            Username: Abhinab
          </Text>
          <Text className="mb-2 text-base text-foreground">
            Email: abhinabchoudhury291@gmail.com
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
