import React from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useUser } from '@clerk/clerk-expo';

export default function Profile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="mt-3 text-gray-600">Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1">
      {/* Profile Section */}
      <View className="items-center p-6">
        <Image source={{ uri: user?.imageUrl }} className="w-24 h-24 rounded-full mb-4" />
        <Text className="text-2xl font-bold text-center text-gray-800">
          {user?.fullName || 'Guest User'}
        </Text>
        <Text className="text-gray-600">{user?.primaryEmailAddress?.emailAddress}</Text>
        <Text className="text-gray-500 text-sm">
          Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
        </Text>
      </View>

      {/* Details Section */}
      <View className="bg-white p-6 mx-3 rounded-xl shadow-sm mb-3">
        <Text className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Personal Information
        </Text>

        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-600 font-semibold">Phone</Text>
          <Text className="text-gray-800">{user?.phone || 'Not provided'}</Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-600 font-semibold">Location</Text>
          <Text className="text-gray-800">{user?.address || 'Not provided'}</Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-600 font-semibold">Farm Size</Text>
          <Text className="text-gray-800">{user?.farmSize || 'Not provided'}</Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-600 font-semibold">Preferred Crops</Text>
          <Text className="text-gray-800">Not specified</Text>
        </View>
      </View>

      {/* Footer */}
      <View className="p-6 items-center">
        <Text className="text-black text-sm mb-1 text-center">
          Crop AI - Powered by AI for Farmers
        </Text>
        <Text className="text-black text-sm text-center">
          In collaboration with Government of Jharkhand
        </Text>
      </View>
    </ScrollView>
  );
}
