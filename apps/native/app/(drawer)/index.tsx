import React, { useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { ChatInput } from '@/components/chatInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function Home() {
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      router.replace('/(drawer)');
    } else {
      router.replace('/(drawer)/login');
    }
  }, [isSignedIn, user, isLoaded, router]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            {/* Centered Welcome Text */}
            <View className="flex-1 justify-center items-center px-6">
              <Text className="text-2xl font-poppinsBold text-center mb-4">Welcome to Crop AI</Text>
            </View>

            {/* Chat Input absolutely at bottom */}
            <View className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200">
              <ChatInput />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
