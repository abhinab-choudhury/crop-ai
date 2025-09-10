import React, { useState } from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChatInput() {
  const [text, setText] = useState("");
  const [inputHeight, setInputHeight] = useState(40);

  return (
    <View className="flex flex-row gap-2">
      <View className="flex-1 rounded-xl bg-gray-100 border border-gray-300 px-3 py-2 max-h-32">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message..."
          placeholderTextColor="#888"
          multiline
          className="text-base text-black font-poppins"
          style={{
            minHeight: 40,
            height: inputHeight,
          }}
          onContentSizeChange={(e) =>
            setInputHeight(e.nativeEvent.contentSize.height)
          }
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          console.log("Send:", text);
          setText("");
          setInputHeight(40);
        }}
        className="w-20 bg-teal-500 rounded-full items-center justify-center"
      >
        <Ionicons name="send" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
