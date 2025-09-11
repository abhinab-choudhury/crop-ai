import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { ChatInput } from '@/components/chatInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

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
              <Text className="text-2xl font-poppinsBold text-center mb-4">
                Welcome to Crop AI{user?.name ? `, ${user.name}` : ''}
              </Text>

              {!isAuthenticated && (
                <TouchableOpacity
                  className="bg-green-600 px-6 py-3 rounded-lg mt-6"
                  onPress={() => router.push('/login')}
                >
                  <Text className="text-white font-semibold">Login to Continue</Text>
                </TouchableOpacity>
              )}

              {isAuthenticated && (
                <TouchableOpacity
                  className="bg-green-600 px-6 py-3 rounded-lg mt-6"
                  onPress={() => router.push('/profile')}
                >
                  <Text className="text-white font-semibold">View Profile</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Chat Input absolutely at bottom */}
            {isAuthenticated && (
              <View className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200">
                <ChatInput />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
