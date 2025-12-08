import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import api from '@/lib/axiosInstance';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      console.log('Requesting permissions...');
      await Audio.requestPermissionsAsync();

      console.log('Starting recording...');
      const recording = new Audio.Recording();

      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);

      await recording.startAsync();

      recordingRef.current = recording;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording...');
    const recording = recordingRef.current;
    if (!recording) return null;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording saved at:', uri);

      setIsRecording(false);
      return uri;
    } catch (err) {
      console.error('Stop recording error:', err);
      return null;
    }
  };

  const uploadAudio = async (uri: string) => {
    const file = {
      uri,
      type: 'audio/m4a',
      name: 'audio.m4a',
    };

    const formData = new FormData();
    formData.append('file', file as any);

    try {
      const response = await api.post('/upload/audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = response.data?.data?.file_path;

      if (uploadedUrl) {
        const fullUrl = `${process.env.EXPO_PUBLIC_SERVER_URL}/${uploadedUrl}`;
        setAudioUrl(fullUrl);
        return fullUrl;
      }
    } catch (err) {
      console.error('Audio upload failed:', err);
    }

    return null;
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    uploadAudio,
    audioUrl,
    setAudioUrl,
  };
}
