import * as React from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import loadResNet50, { runInference } from '@/lib/disease-detection';

interface PredictionResult {
  predictedClass: string;
  confidence: string;
}

export default function DiagnosisScreen() {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<PredictionResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { user } = useUser();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      router.replace('/(drawer)/login');
    }
  }, [user]);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 1 });
    if (!res.canceled) {
      const uri = res.assets[0].uri;
      setSelectedImage(uri);
      predict(uri);
    }
  };

  const captureImage = async () => {
    const res = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!res.canceled) {
      const uri = res.assets[0].uri;
      setSelectedImage(uri);
      predict(uri);
    }
  };

  const predict = async (imageUri: string) => {
    try {
      setLoading(true);
      await loadResNet50();
      const output = await runInference(imageUri);
      setResult(output as PredictionResult);
    } catch (error) {
      console.error('Prediction error:', error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12 justify-between">
      <View className="flex-1 justify-center items-center space-y-4">
        <Text className="text-3xl font-poppinsBold text-teal-700 text-center">
          Crop Disease Detection
        </Text>
        <Text className="text-center font-poppinsRegular text-teal-600 text-base max-w-xs">
          Detect crop diseases in real-time using our AI-powered system.
        </Text>

        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            className="w-64 h-64 rounded-2xl shadow-lg mt-4"
            resizeMode="cover"
          />
        )}

        {loading && <ActivityIndicator size="large" color="#14B8A6" />}
        {result && !loading && (
          <View className="mt-4 bg-teal-100 p-4 rounded-2xl shadow-md">
            <Text className="text-teal-800 font-poppinsSemiBold text-lg">
              {result.predictedClass}
            </Text>
            <Text className="text-teal-700 font-poppinsRegular text-base">
              Confidence: {result.confidence}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row justify-between mt-8 mb-6 gap-2">
        <TouchableOpacity
          onPress={pickImage}
          className="flex-1 flex-row justify-center items-center p-4 rounded-2xl bg-teal-600 shadow-md"
        >
          <Ionicons name="images-sharp" size={24} color="white" />
          <Text className="text-white ml-2 font-poppinsSemiBold">Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={captureImage}
          className="flex-1 flex-row justify-center items-center p-4 rounded-2xl bg-teal-600 shadow-md"
        >
          <Ionicons name="camera-outline" size={24} color="white" />
          <Text className="text-white ml-2 font-poppinsSemiBold">Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
