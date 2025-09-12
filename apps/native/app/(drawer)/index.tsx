import React, { useRef, useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import botIcon from '@/assets/bot.png';

type FeatureType = 'greet' | 'feature1' | 'feature2' | 'feature3' | 'default';

type Message = {
  id: string;
  type: 'text' | 'image';
  content: string;
  sender: 'user' | 'bot';
  feature?: FeatureType;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // --- Demo Bot Features ---
  const botFeatures: Record<FeatureType, Message> = {
    greet: {
      id: '1',
      type: 'text',
      content:
        'Hey! 👋 I’m your smart farm assistant. Ask me about crops, soil, weather, or markets!',
      sender: 'bot',
      feature: 'greet',
    },
    feature1: {
      id: '2',
      type: 'text',
      content:
        '📍 Location: Bhubaneswar, India\n\n🌦 Weather: 32°C, partly cloudy, light rain expected in 2 days.\n\n🌱 Suggested Crops:\n- Rice (ideal with upcoming rain)\n- Maize (resilient & profitable)\n- Vegetables (tomato, okra)\n\n💡 Tip: Try rainwater harvesting to save excess water.',
      sender: 'bot',
      feature: 'feature1',
    },
    feature2: {
      id: '3',
      type: 'text',
      content:
        '🩺 Plant Health Analysis\n\n⚠️ Detected Issue: Leaf spots observed on maize leaves (likely **Turcicum Leaf Blight / Gray Leaf Spot**).\n\n🌱 Cause: Fungal infection due to humid conditions and poor air circulation.\n\n💡 Recommendation:\n- Spray a fungicide containing **Mancozeb** or **Azoxystrobin**.\n- Ensure proper crop spacing for airflow.\n- Remove heavily infected leaves to prevent spread.\n\n👉 Early treatment will protect yield and stop the disease from spreading.',
      sender: 'bot',
      feature: 'feature2',
    },
    feature3: {
      id: '4',
      type: 'text',
      content:
        '📊 **Market Insights**\n\n🌾 Rice demand rising (↑12% this month)\n🌽 Maize stable (good export value)\n🥬 Vegetables prices fluctuating due to supply gaps\n\n💰 Best profit crop right now: **Rice + Maize rotation**',
      sender: 'bot',
      feature: 'feature3',
    },
    default: {
      id: '5',
      type: 'text',
      content:
        '🤖 That’s interesting! You can ask me:\n- Weather update 🌦\n- Soil health 🧪\n- Market insights 📊\n- Crop suggestions 🌱',
      sender: 'bot',
      feature: 'default',
    },
  };

  // --- Handle Sending User Message ---
  const sendMessage = () => {
    if (!text.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'text',
      content: text,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    const query = text.toLowerCase();
    setText('');
    scrollToEnd();
    fakeBotReply(query);
  };

  // --- Match user query with features ---
  const detectFeature = (query: string): FeatureType => {
    if (query.includes('hello') || query.includes('hi')) return 'greet';
    if (query.includes('weather') || query.includes('crop')) return 'feature1';
    if (query.includes('template') || query.includes('image')) return 'feature2';
    if (query.includes('market') || query.includes('profit')) return 'feature3';
    return 'default';
  };

  // --- Fake Bot Typing + Response ---
  const fakeBotReply = (query: string) => {
    setIsTyping(true);
    const feature = detectFeature(query);

    setTimeout(() => {
      const response = botFeatures[feature];
      const botMessage: Message = {
        ...response,
        id: Date.now().toString(), // ensure unique id
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      scrollToEnd();
    }, 1200);
  };

  const sendImage = () => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'image',
      content:
        'https://cropprotectionnetwork.org/image?s=%2Fimg%2Fhttp%2Fgeneral%2Ftar-northern-southern-foliar-disease-sisson.jpg%2F034d51d6214a9018a973b03e9d35f4e1.jpg&h=0&w=316&fit=contain',
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    scrollToEnd();
    fakeBotReply('image');
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // --- Render each message ---
  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginVertical: 4,
        }}
      >
        {!isUser && (
          <Image
            source={botIcon}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              marginRight: 8,
              alignSelf: 'flex-end',
            }}
          />
        )}
        <View
          style={{
            backgroundColor: isUser ? '#20C997' : '#E6F7F5',
            padding: 10,
            borderRadius: 16,
            maxWidth: '75%',
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 3,
          }}
        >
          {item.type === 'image' ? (
            <Image
              source={{ uri: item.content }}
              style={{ width: 180, height: 180, borderRadius: 12 }}
            />
          ) : (
            <Text style={{ color: isUser ? '#fff' : '#004D40', fontSize: 15 }}>{item.content}</Text>
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
        contentContainerStyle={{ padding: 15 }}
        onContentSizeChange={scrollToEnd}
        onLayout={scrollToEnd}
      />

      {isTyping && (
        <View style={{ flexDirection: 'row', paddingLeft: 15, marginBottom: 5 }}>
          <ActivityIndicator size="small" color="#20C997" />
          <Text style={{ marginLeft: 8, color: '#20C997' }}>Bot is typing…</Text>
        </View>
      )}

      {/* Input bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          borderTopWidth: 1,
          borderColor: '#eee',
          backgroundColor: '#fff',
        }}
      >
        <TouchableOpacity onPress={sendImage} style={{ marginRight: 10 }}>
          <Ionicons name="image-outline" size={28} color="#20C997" />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f8f8f8',
            borderRadius: 25,
            paddingHorizontal: 15,
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            style={{
              flex: 1,
              paddingVertical: 8,
              fontSize: 16,
            }}
          />
          <TouchableOpacity className="mr-4" onPress={() => {}}>
            <Ionicons name="mic-outline" size={24} color="#20C997" />
          </TouchableOpacity>
          <TouchableOpacity onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#20C997" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
