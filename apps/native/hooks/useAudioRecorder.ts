import { useState } from 'react';
import { Audio } from 'expo-av';
import api from '@/lib/axiosInstance';

export function useAudioRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recording);
    } catch (err) {
      console.error('🎙️ Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return null;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (!uri) return null;
      return uri;
    } catch (err) {
      console.error('❌ Error stopping recording:', err);
      return null;
    }
  }

  async function uploadAudio(uri: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    } as any);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!res.data.success) throw new Error('Upload failed');
      return res.data.url;
    } catch (err) {
      console.error('❌ Upload error', err);
      throw err;
    }
  }

  return { startRecording, stopRecording, uploadAudio, recording };
}
