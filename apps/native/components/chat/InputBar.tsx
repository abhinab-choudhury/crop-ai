import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InputBar({
  text,
  setText,
  onSend,
  onPickImage,
  isUploading,
  micIcon,
  onMicPress,
}: any) {
  return (
    <View style={{ padding: 10, flexDirection: 'row', borderTopWidth: 1, borderColor: '#eee' }}>
      <TouchableOpacity onPress={onPickImage} style={{ marginRight: 12 }}>
        {isUploading ? (
          <ActivityIndicator />
        ) : (
          <Ionicons name="image-outline" size={28} color="#20C997" />
        )}
      </TouchableOpacity>

      <View
        style={{
          flex: 1,
          backgroundColor: '#f3f3f3',
          borderRadius: 20,
          flexDirection: 'row',
          paddingHorizontal: 12,
        }}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          style={{ flex: 1, paddingVertical: 10 }}
        />

        <TouchableOpacity onPress={onMicPress} style={{ marginRight: 10 }}>
          {micIcon}
        </TouchableOpacity>

        <TouchableOpacity onPress={onSend} disabled={!text.trim()}>
          <Ionicons name="send" size={24} color={text.trim() ? '#20C997' : '#aaa'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
