import { View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ImagePreview({ uri, onRemove }: { uri: string; onRemove: () => void }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ width: 120, height: 120 }}>
        <Image source={{ uri }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />

        <TouchableOpacity
          onPress={onRemove}
          style={{
            position: 'absolute',
            top: -10,
            right: -10,
            padding: 5,
            backgroundColor: 'red',
            borderRadius: 30,
          }}
        >
          <Ionicons name="close" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
