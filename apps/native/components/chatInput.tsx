import React, { useState } from "react";
import {
  TextInput,
  View,
  Keyboard,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function ChatInput() {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return; 
    setText("");
    Keyboard.dismiss();
  };

  return (
    <View className="flex-row items-center gap-2 p-2 bg-white">
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Message..."
        placeholderTextColor="#888"
        className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-base text-black font-poppins"
        returnKeyType="send"
        onSubmitEditing={handleSend}
      />

      <Pressable
        onPress={handleSend}
        className={`w-10 h-10 rounded-full items-center justify-center ${
          text.trim() ? "bg-teal-500" : "bg-gray-300"
        }`}
      >
        <Ionicons name="send" size={18} color="#fff" />
      </Pressable>
    </View>
  );
}
