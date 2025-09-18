import * as React from 'react';
import { View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';

export default function CropRecommendationForm() {
  const { user } = useUser();
  const [form, setForm] = React.useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    rainfall: '',
    latitude: '',
    longitude: '',
  });

  if (!user?.primaryEmailAddress?.emailAddress) {
    router.replace('/(drawer)/login');
  }

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    console.log('Form Data:', form);
    // Call API for crop recommendation
  };

  const inputFields = [
    { key: 'nitrogen', label: 'Nitrogen (N)' },
    { key: 'phosphorus', label: 'Phosphorus (P)' },
    { key: 'potassium', label: 'Potassium (K)' },
    { key: 'ph', label: 'pH Level' },
    { key: 'rainfall', label: 'Rainfall (mm)' },
    { key: 'latitude', label: 'Latitude' },
    { key: 'longitude', label: 'Longitude' },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'white' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Text className="text-3xl font-poppinsBold text-teal-700 text-center mb-6">
          Crop Recommendation
        </Text>
        <Text className="text-center text-teal-600 text-base mb-8 max-w-xs self-center">
          Enter your soil and location parameters to get the best crop suggestions.
        </Text>

        {inputFields.map((field) => (
          <View key={field.key} style={{ width: '100%', marginBottom: 16 }}>
            <Text className="text-teal-700 font-poppinsRegular mb-1">{field.label}</Text>
            <Input
              value={form[field.key as keyof typeof form]}
              onChangeText={(value) => handleChange(field.key, value)}
              keyboardType="numeric"
              placeholder={`Enter ${field.label}`}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        ))}

        <TouchableOpacity
          onPress={handleSubmit}
          className="mt-6 bg-teal-600 rounded-xl py-4 w-full items-center shadow-md"
        >
          <Text className="text-white font-poppinsSemiBold text-lg">Get Recommendation</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
