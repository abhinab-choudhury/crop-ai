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
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

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

const RecordingIndicator = ({ isRecording }: { isRecording: boolean }) => {
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, { toValue: 0.2, duration: 700, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      opacityAnim.stopAnimation();
      opacityAnim.setValue(1);
    }
  }, [isRecording]);

  if (!isRecording) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15, marginBottom: 5 }}>
      <Animated.View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: 'red',
          opacity: opacityAnim,
        }}
      />
      <Text style={{ marginLeft: 8, color: '#e53e3e' }}>Recording...</Text>
    </View>
  );
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
  const { startRecording, stopRecording, uploadAudio } = useAudioRecorder();

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
        const res = await api.post('/api/chat', { userId: user?.id, message: query, image_uri });
        const data = res.data.data;

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'text',
            content: data?.finalResponse || '⚠️ No response',
            image_uri,
            sender: 'bot',
          },
        ]);
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'text',
            content: 'Couldn’t connect to server.',
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
      // await startRecording();
      setIsRecording(true);
    } else {
      setIsRecording(false);

      try {
        // const uri = await stopRecording();
        // if (!uri) throw new Error("No recording URI");
        // const uploadedUrl = await uploadAudio(uri);
        // if (!uploadedUrl) throw new Error("No audio URL from server");
        // console.log("✅ Audio uploaded:", uploadedUrl);
        // setMessages((prev) => [
        //   ...prev,
        //   {
        //     id: Date.now().toString(),
        //     type: "audio",
        //     content: uploadedUrl,
        //     sender: "user",
        //   },
        // ]);
        // scrollToEnd();
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

  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      router.replace('/(drawer)/login');
    }
  }, [user]);

  const isTextMessage = (msg: Message): msg is Extract<Message, { type: 'text' }> => {
    return msg.type === 'text';
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
                marginTop: isTextMessage(item) ? 8 : 0,
                resizeMode: 'cover',
              }}
            />
          )}

          {item.type === 'audio' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: isTextMessage(item) ? 8 : 0,
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
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          borderTopWidth: 1,
          borderColor: '#eee',
        }}
      >
        <TouchableOpacity onPress={pickImage} style={{ marginRight: 10 }}>
          {isUploadingImage ? (
            <ActivityIndicator size="small" color="#20C997" />
          ) : (
            <Ionicons name="image-outline" size={28} color="#20C997" />
          )}
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f8f8f8',
            borderRadius: 25,
            paddingHorizontal: 10,
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            style={{ flex: 1, paddingVertical: 10, fontSize: 16 }}
          />

          <TouchableOpacity onPress={toggleMic} style={{ marginRight: 12 }}>
            <Animated.View
              style={{
                transform: [{ scale: micScale }],
                padding: 6,
                borderRadius: 50,
                backgroundColor: isRecording ? '#b22222' : '#05998c',
              }}
            >
              <Ionicons name="mic" size={20} color="#fff" />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => sendMessage(text, imageUri || '')}
            disabled={!text.trim()}
            style={{
              padding: 8,
              borderRadius: 50,
              backgroundColor: text.trim() ? '#14B8A6' : '#D1D5DB',
            }}
          >
            <Ionicons name="send" size={20} color={text.trim() ? '#fff' : '#6b7280'} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
