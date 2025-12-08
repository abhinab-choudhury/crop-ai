import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import api from '@/lib/axiosInstance';
import botIcon from '@/assets/bot.png';
import RecordingIndicator from '@/components/chat/RecordingIndicator';

type Message = {
  id: string;
  type: 'text' | 'image' | 'audio';
  content: string;
  sender: 'user' | 'bot';
};

const welcomeContent = {
  title: 'Welcome to Crop AI 🌱',
  subtitle: 'Try asking one of these questions:',
  questions: [
    { text: "📍 What's the best crop for Bhubaneswar?", query: 'weather for Bhubaneswar' },
    { text: '🦠 Detect crop disease from an image', query: 'detect disease' },
    { text: '📈 Which crop gives best profit this season?', query: 'market prices' },
  ],
};

export default function ChatScreen() {
  const { user } = useUser();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const micScale = useRef(new Animated.Value(1)).current;

  const animateMic = () =>
    Animated.sequence([
      Animated.timing(micScale, { toValue: 1.4, duration: 200, useNativeDriver: true }),
      Animated.timing(micScale, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

  const scrollToEnd = () =>
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

  const fetchReply = useCallback(
    async (query: string, image_uri: string) => {
      setIsTyping(true);

      try {
        const res = await api.post('/api/chat', {
          userId: user?.id,
          message: query,
          image_uri,
        });

        const finalResponse = res?.data?.data?.finalResponse;

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'text',
            content: finalResponse ?? '⚠️ AI did not return a response',
            sender: 'bot',
          },
        ]);
      } catch (err) {
        console.log('chat error:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'text',
            content: '❌ Error contacting AI server',
            sender: 'bot',
          },
        ]);
      } finally {
        setIsTyping(false);
        setImageUri(null);
        scrollToEnd();
      }
    },
    [user],
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
    if (!result.canceled) {
      const file = {
        uri: result.assets[0].uri,
        name: 'upload.jpg',
        type: 'image/jpeg',
      };

      const formData = new FormData();
      formData.append('file', file as any);

      try {
        setIsUploadingImage(true);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const uploadedUrl = uploadRes.data?.data?.file_path;
        if (!uploadedUrl) throw new Error('No file_url from server');
        setImageUri(`${process.env.EXPO_PUBLIC_SERVER_URL}/${uploadedUrl}`);
      } catch (err) {
        console.error('Image upload failed:', err);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const toggleMic = async () => {
    animateMic();

    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);

      try {
      } catch (err) {
        console.error('❌ Audio upload failed:', err);
      }
    }
  };

  const sendMessage = (message: string, image_uri: string | null) => {
    if (!message.trim() && !image_uri) return;

    const newMessages: Message[] = [];

    if (message.trim()) {
      newMessages.push({
        id: Date.now().toString() + '_text',
        type: 'text',
        content: message,
        sender: 'user',
      });
    }

    if (image_uri) {
      newMessages.push({
        id: Date.now().toString() + '_img',
        type: 'image',
        content: image_uri,
        sender: 'user',
      });
    }

    setMessages((prev) => [...prev, ...newMessages]);

    fetchReply(message, image_uri || '');

    setText('');
    setImageUri(null);
    scrollToEnd();
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginVertical: 6,
        }}
      >
        {!isUser && (
          <Image
            source={botIcon}
            style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
          />
        )}

        <View
          style={{
            backgroundColor: isUser ? '#20C997' : '#E6F7F5',
            padding: 12,
            borderRadius: 16,
            maxWidth: '75%',
            overflow: 'hidden',
          }}
        >
          {item.type === 'text' && (
            <Text style={{ color: isUser ? '#fff' : '#004D40', fontSize: 16 }}>{item.content}</Text>
          )}

          {item.type === 'image' && (
            <Image
              source={{ uri: item.content }}
              style={{
                width: 200,
                height: 200,
                resizeMode: 'cover',
              }}
            />
          )}

          {item.type === 'audio' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="play" size={24} color="#fff" />
              <Text style={{ color: '#fff', marginLeft: 8 }}>{item.content}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      router.replace('/(drawer)/login');
    }
  }, [user]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 15,
          flexGrow: 1,
          justifyContent: messages.length ? 'flex-start' : 'center',
        }}
        onContentSizeChange={scrollToEnd}
        onLayout={scrollToEnd}
        ListEmptyComponent={
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="leaf-outline" size={40} color="#20C997" />
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 8 }}>
              {welcomeContent.title}
            </Text>
            <Text style={{ color: '#666', marginTop: 4, marginBottom: 16 }}>
              {welcomeContent.subtitle}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {welcomeContent.questions.map((q, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => sendMessage(q.query, '')}
                  style={{ backgroundColor: '#E6F7F5', padding: 8, borderRadius: 12, margin: 4 }}
                >
                  <Text style={{ color: '#004D40' }}>{q.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
      />

      {isTyping && (
        <View style={{ flexDirection: 'row', paddingLeft: 15, marginBottom: 5 }}>
          <ActivityIndicator size="small" color="#20C997" />
          <Text style={{ marginLeft: 8, color: '#20C997' }}>Bot is typing…</Text>
        </View>
      )}

      <RecordingIndicator isRecording={isRecording} />

      {imageUri && (
        <View className="mb-2">
          <View className="relative w-28 h-28">
            <Image source={{ uri: imageUri }} className="w-full h-full rounded-lg" />
            <TouchableOpacity
              onPress={() => setImageUri(null)}
              className="absolute top-4 right-0 -translate-x-1/4 -translate-y-1/4 p-1 bg-red-600 rounded-full"
            >
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Input Bar */}
      <View
        style={{
          padding: 12,
          borderColor: '#ececec',
          backgroundColor: '#ffffff',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f1f3f5',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 3,
          }}
        >
          {/* Image Upload Button */}
          <TouchableOpacity onPress={pickImage} style={{ marginRight: 10, padding: 6 }}>
            {isUploadingImage ? (
              <ActivityIndicator size="small" color="#20C997" />
            ) : (
              <Ionicons name="image" size={24} color="#20C997" />
            )}
          </TouchableOpacity>

          {/* Text Input */}
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message Crop AI…"
            placeholderTextColor="#9ca3af"
            style={{
              flex: 1,
              fontSize: 16,
              paddingVertical: 6,
              paddingHorizontal: 4,
              color: '#333',
            }}
          />

          {/* Mic Button */}
          <TouchableOpacity onPress={toggleMic} style={{ marginRight: 10 }}>
            <Animated.View
              style={{
                transform: [{ scale: micScale }],
                padding: 8,
                borderRadius: 50,
                backgroundColor: isRecording ? '#dc2626' : '#20C997',
              }}
            >
              <Ionicons name="mic" size={20} color="#fff" />
            </Animated.View>
          </TouchableOpacity>

          {/* Send Button */}
          <TouchableOpacity
            onPress={() => sendMessage(text, imageUri || '')}
            disabled={!text.trim()}
            style={{
              padding: 10,
              borderRadius: 50,
              backgroundColor: text.trim() ? '#16a34a' : '#d1d5db',
            }}
          >
            <Ionicons name="send" size={18} color={text.trim() ? '#fff' : '#6b7280'} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
