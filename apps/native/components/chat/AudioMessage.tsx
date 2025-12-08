import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function AudioMessage({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: url });

    setPlaying(true);
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status?.isPlaying) {
        setPlaying(false);
        sound.unloadAsync();
      }
    });
  };

  return (
    <TouchableOpacity
      onPress={playSound}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
      }}
    >
      <Ionicons name={playing ? 'pause' : 'play'} size={24} color="#fff" />
      <Text style={{ color: '#fff', marginLeft: 8 }}>Audio message</Text>
    </TouchableOpacity>
  );
}
