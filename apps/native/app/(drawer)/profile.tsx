import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';

type EditableRowProps = {
  label: string;
  value: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onChangeText: (text: string) => void;
};

const EditableRow: React.FC<EditableRowProps> = ({
  label,
  value,
  isEditing,
  onEdit,
  onSave,
  onChangeText,
}) => {
  return (
    <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 pb-4">
      <Text className="text-gray-600 font-semibold w-1/3">{label}</Text>
      <View className="flex-1 items-end">
        {isEditing ? (
          <TextInput
            className="text-gray-800 text-right w-full border-b border-teal-600 px-2"
            value={value}
            onChangeText={onChangeText}
            autoFocus={true}
          />
        ) : (
          <Text className="text-gray-800 text-right">{value}</Text>
        )}
      </View>
      <View className="w-16 items-end">
        <TouchableOpacity onPress={isEditing ? onSave : onEdit} className="pl-4">
          <Text className="text-teal-600 font-semibold">{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function ProfileScreen() {
  const { user } = useUser();

  const [phone, setPhone] = useState<string>('Not provided');
  const [location, setLocation] = useState<string>('Not provided');
  const [farmSize, setFarmSize] = useState<string>('Not provided');
  const [preferredCrops, setPreferredCrops] = useState<string>('Not specified');

  const [isEditingPhone, setIsEditingPhone] = useState<boolean>(false);
  const [isEditingLocation, setIsEditingLocation] = useState<boolean>(false);
  const [isEditingFarmSize, setIsEditingFarmSize] = useState<boolean>(false);
  const [isEditingCrops, setIsEditingCrops] = useState<boolean>(false);

  const { isLoaded } = useUser();

  if (!user?.primaryEmailAddress?.emailAddress) {
    return <Redirect href="/(drawer)/login" />;
  }

  useEffect(() => {
    const loadLocalData = async () => {
      if (user) {
        try {
          const [savedPhone, savedLocation, savedFarmSize, savedCrops] = await Promise.all([
            AsyncStorage.getItem(`@phone_${user.id}`),
            AsyncStorage.getItem(`@location_${user.id}`),
            AsyncStorage.getItem(`@farmSize_${user.id}`),
            AsyncStorage.getItem(`@preferredCrops_${user.id}`),
          ]);

          if (savedPhone !== null) setPhone(savedPhone);
          if (savedLocation !== null) setLocation(savedLocation);
          if (savedFarmSize !== null) setFarmSize(savedFarmSize);
          if (savedCrops !== null) setPreferredCrops(savedCrops);
        } catch (e) {
          console.error('Failed to load data from storage', e);
        }
      }
    };

    loadLocalData();
  }, [user]);

  const handleSave = async (
    key: string,
    value: string,
    setEditing: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (user) {
      try {
        const fullKey = `@${key}_${user.id}`;
        await AsyncStorage.setItem(fullKey, value);
        setEditing(false);
      } catch (e) {
        console.error(`Failed to save ${key} to storage`, e);
      }
    }
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="mt-3 text-gray-600">Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="items-center p-6 bg-white">
        <Image source={{ uri: user?.imageUrl }} className="w-24 h-24 rounded-full mb-4" />
        <Text className="text-2xl font-bold text-center text-gray-800">
          {user?.fullName || 'Guest User'}
        </Text>
        <Text className="text-gray-600">{user?.primaryEmailAddress?.emailAddress}</Text>
        <Text className="text-gray-500 text-sm">
          Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
        </Text>
      </View>

      <View className="bg-white p-6 mx-3 rounded-xl shadow-sm my-4">
        <Text className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Personal Information
        </Text>

        <EditableRow
          label="Phone"
          value={phone}
          isEditing={isEditingPhone}
          onEdit={() => setIsEditingPhone(true)}
          onSave={() => handleSave('phone', phone, setIsEditingPhone)}
          onChangeText={setPhone}
        />

        <EditableRow
          label="Location"
          value={location}
          isEditing={isEditingLocation}
          onEdit={() => setIsEditingLocation(true)}
          onSave={() => handleSave('location', location, setIsEditingLocation)}
          onChangeText={setLocation}
        />

        <EditableRow
          label="Farm Size"
          value={farmSize}
          isEditing={isEditingFarmSize}
          onEdit={() => setIsEditingFarmSize(true)}
          onSave={() => handleSave('farmSize', farmSize, setIsEditingFarmSize)}
          onChangeText={setFarmSize}
        />

        <EditableRow
          label="Preferred Crops"
          value={preferredCrops}
          isEditing={isEditingCrops}
          onEdit={() => setIsEditingCrops(true)}
          onSave={() => handleSave('preferredCrops', preferredCrops, setIsEditingCrops)}
          onChangeText={setPreferredCrops}
        />
      </View>

      <View className="p-6 items-center">
        <Text className="text-gray-500 text-sm mb-1 text-center">
          Crop AI - Powered by AI for Farmers
        </Text>
        <Text className="text-gray-500 text-sm text-center">
          In collaboration with Government of Jharkhand
        </Text>
      </View>
    </ScrollView>
  );
}
