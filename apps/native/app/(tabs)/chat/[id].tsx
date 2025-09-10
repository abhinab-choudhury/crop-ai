import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Container } from "@/components/container";

export default function NewChat() {
  const params = useLocalSearchParams<{ id: string }>();
  const chatId = params.id;

  return (
    <Container>
      <View className="flex-1 items-center justify-center">
        <Text className="font-bold text-lg">Chat-ID: {chatId}</Text>
      </View>
    </Container>
  );
}
