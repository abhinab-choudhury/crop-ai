import * as React from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // <-- icons
// import { recommendCrop } from "@/lib/crop-recommendation";

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
  const [result, setResult] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  if (!user?.primaryEmailAddress?.emailAddress) {
    router.replace('/(drawer)/login');
  }

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('Form Data:', form);
      // const predict = await recommendCrop(...)
      await new Promise((r) => setTimeout(r, 1500)); // fake delay
      setResult('🍎 Apple');
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { key: 'nitrogen', label: 'Nitrogen (N)', icon: 'leaf' },
    { key: 'phosphorus', label: 'Phosphorus (P)', icon: 'water' },
    { key: 'potassium', label: 'Potassium (K)', icon: 'flask' },
    { key: 'ph', label: 'pH Level', icon: 'beaker' },
    { key: 'rainfall', label: 'Rainfall (mm)', icon: 'rainy' },
    { key: 'latitude', label: 'Latitude', icon: 'compass' },
    { key: 'longitude', label: 'Longitude', icon: 'navigate' },
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
        {/* Title */}
        <Text className="text-3xl font-poppinsBold text-teal-700 text-center mb-2">
          🌱 Crop Recommendation
        </Text>
        <Text className="text-center text-teal-600 text-base mb-6 max-w-xs self-center">
          Enter your soil and location parameters to get the best crop suggestions.
        </Text>

        {/* Input Form */}
        <View className="bg-gray-50 rounded-2xl p-5 w-full shadow-sm">
          {inputFields.map((field) => (
            <View
              key={field.key}
              style={{
                width: '100%',
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name={field.icon as any}
                size={20}
                color="#0f766e"
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text className="text-teal-700 font-poppinsRegular mb-1">{field.label}</Text>
                <Input
                  value={form[field.key as keyof typeof form]}
                  onChangeText={(value) => handleChange(field.key, value)}
                  keyboardType="numeric"
                  placeholder={`Enter ${field.label}`}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className="mt-6 bg-teal-600 rounded-2xl py-4 w-full items-center shadow-lg"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-poppinsSemiBold text-lg">Get Recommendation</Text>
          )}
        </TouchableOpacity>

        {/* Result */}
        {result && (
          <View className="mt-6 bg-green-50 p-4 rounded-2xl shadow-md w-full items-center">
            <Text className="font-poppinsBold text-2xl text-green-700">Grow: {result}</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
