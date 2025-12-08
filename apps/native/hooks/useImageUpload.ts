import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import api from '@/lib/axiosInstance';

export function useImageUpload() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });

    if (result.canceled) return;

    const file = {
      uri: result.assets[0].uri,
      name: 'upload.jpg',
      type: 'image/jpeg',
    };

    const formData = new FormData();
    formData.append('file', file as any);

    try {
      setIsUploadingImage(true);

      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const url = response.data?.data?.file_path;
      if (url) setImageUri(`${process.env.EXPO_PUBLIC_SERVER_URL}/${url}`);
    } catch (error) {
      console.error('Image upload failed', error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return { imageUri, setImageUri, pickImage, isUploadingImage };
}
