import React, { useRef, useState, useEffect } from 'react';
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
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import botIcon from '@/assets/bot.png';
import api from '../../api/api'
import * as ImagePicker from "expo-image-picker";

type FeatureType = 'greet' | 'weather' | 'disease' | 'market' | 'soil' | 'default';
type Language = 'en' | 'hi';

type Message = {
  id: string;
  type: 'text' | 'image' | 'audio';
  content: string;
  sender: 'user' | 'bot';
  feature?: FeatureType;
  lang?: Language;
};

// --- Dummy Auth State ---
const dummyAuth = {
  isAuthenticated: true,
  user: { name: 'Farmer Ram', id: '123' },
};

// (Bot features and welcome content remain the same)
const botFeatures: Record<Language, Record<FeatureType, string>> = {
  hi: {
    greet: 'नमस्ते किसान भाई 👋 मैं आपका खेती सहायक हूँ।',
    weather: '📍 भुवनेश्वर मौसम:\n🌦 32°C, हल्की बदली।\n🌱 सुझाई गई फसलें: धान, मक्का, टमाटर।',
    disease:
      '🩺 पौधों की सेहत: मक्का की पत्तियों पर धब्बे → फफूंद रोग। कृपया इलाज के लिए नीम तेल का छिड़काव करें।',
    market: '📊 बाज़ार अपडेट: धान ↑12%, मक्का स्थिर।',
    soil: '🧪 मिट्टी की जाँच: आपकी आवाज़ के अनुसार, मिट्टी में नाइट्रोजन की कमी है। यूरिया डालें।',
    default: '🤖 मैंने सही से समझा नहीं। आप मौसम 🌦, रोग 🦠, बाज़ार 📊 पूछ सकते हैं।',
  },
  en: {
    greet: "Hey 👋 I'm your farm assistant.",
    weather:
      '📍 Bhubaneswar Weather:\n🌦 32°C, partly cloudy.\n🌱 Suggested crops: Rice, Maize, Tomato.',
    disease:
      '🩺 Plant Health: Leaf spots detected on maize → fungal disease. Please spray neem oil for treatment.',
    market: '📊 Market Update: Rice ↑12%, Maize stable.',
    soil: '🧪 Soil Health: Based on your voice note, the soil seems nitrogen-deficient. Add compost or urea.',
    default: '🤖 I didn’t quite get that. Try asking: Weather, Market, Soil, or Disease.',
  },
};
const welcomeContent: Record<
  Language,
  { title: string; subtitle: string; questions: { text: string; query: string }[] }
> = {
  en: {
    title: 'Welcome to Crop AI 🌱',
    subtitle: 'Try asking one of these questions:',
    questions: [
      { text: "📍 What's the best crop for Bhubaneswar?", query: 'weather for Bhubaneswar' },
      { text: '🦠 Detect crop disease from an image', query: 'detect disease' },
      { text: '📈 Which crop gives best profit this season?', query: 'market prices' },
    ],
  },
  hi: {
    title: 'क्रॉप AI में आपका स्वागत है 🌱',
    subtitle: 'इनमें से कोई एक प्रश्न पूछ कर देखें:',
    questions: [
      { text: '📍 भुवनेश्वर के लिए सबसे अच्छी फसल कौन सी है?', query: 'भुवनेश्वर का मौसम' },
      { text: '🦠 तस्वीर से फसल रोग का पता लगाएं', query: 'रोग का पता लगाएं' },
      { text: '📈 इस सीजन में कौन सी फसल सबसे अच्छा मुनाफा देती है?', query: 'बाजार का भाव' },
    ],
  },
};

// 2. New Recording Animation Component
const RecordingIndicator = ({ isRecording }: { isRecording: boolean }) => {
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.2,
            duration: 700,
            useNativeDriver: true,
            easing: Easing.ease,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
            easing: Easing.ease,
          }),
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [uiLang, setUiLang] = useState<Language>('en');

  const micScale = useRef(new Animated.Value(1)).current;
  const animateMic = () => {
    Animated.sequence([
      Animated.timing(micScale, {
        toValue: 1.4,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(micScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
    ]).start();
  };

  const detectLang = (query: string): Language => {
    const hindiChars = /[अ-हऀ-ॿ]/;
    return hindiChars.test(query) ? 'hi' : 'en';
  };
  const detectFeature = (query: string): FeatureType => {
    const q = query.toLowerCase();
    if (q.includes('hello') || q.includes('hi') || q.includes('नमस्ते')) return 'greet';
    if (q.includes('weather') || q.includes('climate') || q.includes('मौसम')) return 'weather';
    if (q.includes('disease') || q.includes('image') || q.includes('रोग')) return 'disease';
    if (q.includes('market') || q.includes('profit') || q.includes('बाज़ार') || q.includes('भाव'))
      return 'market';
    if (q.includes('soil') || q.includes('मिट्टी') || q.includes('voice')) return 'soil';
    return 'default';
  };
  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // its not fakebotdata ---- its fetchBotReply helps to fetch the data from backend
  const fakeBotReply = async (query: string, lang: Language) => {
    setIsTyping(true);

    try {
      const feature = detectFeature(query);
      console.log(feature);


      //fecthing the data from backend rest api ...............
      let data = '';
      if (feature === "market" || feature === "soil" || feature === "weather" || query.includes('N=') || query.includes('K=') || query.includes('latitude') || query.includes('longitude')) {
        console.log("Navigate to Crop Rotation Route");

        try {
          // Example: "N=20,P=10,K=15,ph=6.5,Country=India,State=Odisha,City=Bhubaneswar"
          const inputString = query;

          const res = await api.post("/api/crop-rotation", {
            userId: dummyAuth.user.id,
            inputString,
            language: uiLang
          });

          console.log(res.data);
          data = res.data;
        } catch (error) {
          console.log(error);
        }
      }
      else {
        console.log("Navigate to default route or show message");
        //fecthing the normal chatting data from backend rest api ...............
        try {
          const res = await api.post("/api/chat", {
            sessionId: dummyAuth.user.id,
            message: query,
            lang,
          });
          console.log(res.data);
          data = res.data;
        } catch (error) {
          console.log(error);
        }
      }
      console.log(data);

      const botMessage: Message = {
        id: Date.now().toString(),
        type: data.type || "text",
        content: data.content,
        sender: "bot",
        feature,
        lang,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error fetching bot reply:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "text",
          content: "couldn’t connect to the server.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsTyping(false);
      scrollToEnd();
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 1 });
    if (!result.canceled) {
      await sendImage(result.assets[0].base64);
    }
  };

  //fetching the data from backend of image.........
  const sendImage = async (base64Image: string) => {
    const tempId = Date.now().toString();

    // temporary preview (shows user image before backend responds)
    const previewMessage: Message = {
      id: tempId,
      type: "image",
      content: `data:image/jpeg;base64,${base64Image}`,
      sender: "user",
    };
    setMessages((prev) => [...prev, previewMessage]);
    scrollToEnd();

    try {
      setIsTyping(true);

      // send to backend
      const res = await api.post("/api/upload", {
        userId: dummyAuth.user.id,
        image: base64Image,
        lang: "en",
      });

      const imageUrl = res.data.url;

      // now call your crop disease detection API
      const analysis = await api.post("/api/crop-disease-detection", {
        userId: dummyAuth.user.id,
        imageUrl,
        lang: "en",
      });

      const data = analysis.data;

      const botMessage: Message = {
        id: Date.now().toString(),
        type: data.type || "text",
        content: data.content,
        sender: "bot",
        lang: uiLang,
        feature: "disease",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Image upload error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "text",
          content: "Couldn’t analyze image.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsTyping(false);
      scrollToEnd();
    }
  };



  // 3. Updated toggleMic logic
  const toggleMic = () => {
    animateMic();
    const currentlyRecording = isRecording;
    setIsRecording(!currentlyRecording);

    if (currentlyRecording) {
      setTimeout(() => {
        const duration = Math.floor(Math.random() * 28) + 2; // Random duration 2-30s
        const audioMessage: Message = {
          id: Date.now().toString(),
          type: 'audio',
          content: `0:${duration.toString().padStart(2, '0')}`,
          sender: 'user',
        };
        setMessages((prev) => [...prev, audioMessage]);
        scrollToEnd();

        const lastTextMessage = [...messages].reverse().find((m) => m.type === 'text');
        const replyLang = lastTextMessage?.lang || uiLang;
        fakeBotReply('voice message about market', replyLang);
      }, 500);
    }
  };

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
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 16,
            maxWidth: '75%',
          }}
        >
          {item.type === 'text' && (
            <Text style={{ color: isUser ? '#fff' : '#004D40', fontSize: 15 }}>{item.content}</Text>
          )}
          {item.type === 'image' && (
            <Image
              source={{ uri: item.content }}
              style={{ width: 180, height: 180, borderRadius: 12 }}
            />
          )}
          {/* 4. New Audio bubble UI */}
          {item.type === 'audio' && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="play" size={24} color="#fff" />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 10,
                  height: 20,
                }}
              >
                {[12, 18, 15, 10, 16, 12, 8, 15, 11].map((h, i) => (
                  <View
                    key={i}
                    style={{
                      width: 2.5,
                      height: h,
                      backgroundColor: '#A7F3D0',
                      borderRadius: 2,
                      marginRight: 2,
                    }}
                  />
                ))}
              </View>
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>{item.content}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  async function handleSuggestionPress(q, lang: Language) {
    const query = q.query.toLowerCase();
    const feature = detectFeature(query);
    if (query.includes("weather") || query.includes("market")) {
      console.log("Navigate to Crop Rotation Route");
      //fecthing the crop rotation data from backend rest api ...............

      try {
        const res = await api.post(`/api/crop-rotation`, {
          userId: dummyAuth.user.id,
          query,
          lang,
          feature,
        });

        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    } else if (query.includes("disease")) {
      console.log("Navigate to Disease Route");
      //fecthing the crop dieases data from backend rest api ...............

      try {
        const res = await api.post("/api/crop-disease-detection", {
          userId: dummyAuth.user.id,
          query,
          lang,
          feature,
        });

        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Navigate to default route or show message");
      //fecthing the normal chatting data from backend rest api ...............
      console.log(query)
      try {
        const res = await api.post("/api/chat", {
          userId: dummyAuth.user.id,
          query,
          lang,
        });
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  }

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
          justifyContent: messages.length === 0 ? 'center' : 'flex-start',
        }}
        onContentSizeChange={scrollToEnd}
        onLayout={scrollToEnd}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Ionicons name="leaf-outline" size={40} color="#20C997" />
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 8 }}>
              {welcomeContent[uiLang].title}
            </Text>
            <Text style={{ color: '#666', textAlign: 'center', marginTop: 4, marginBottom: 16 }}>
              {welcomeContent[uiLang].subtitle}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {welcomeContent[uiLang].questions.map((q, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: '#E6F7F5',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 12,
                    margin: 4,
                  }}
                  onPress={() => handleSuggestionPress(q)}
                >
                  <Text style={{ color: '#004D40', fontWeight: '500', fontSize: 13 }}>
                    {q.text}
                  </Text>
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
        <TouchableOpacity onPress={pickImage} style={{ marginRight: 10 }}>
          <Ionicons name="image-outline" size={28} color="#20C997" />
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
          <TouchableOpacity
            onPress={() => setUiLang(uiLang === 'en' ? 'hi' : 'en')}
            style={{ padding: 8 }}
          >
            <Text style={{ color: '#00796B', fontWeight: 'bold', fontSize: 16 }}>
              {uiLang.toUpperCase()}
            </Text>
          </TouchableOpacity>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            style={{ flex: 1, paddingVertical: 10, fontSize: 16, marginLeft: 5 }}
          />
          <TouchableOpacity onPress={toggleMic} style={{ marginRight: 12 }}>
            <Animated.View
              style={{
                transform: [{ scale: micScale }],
                padding: 4,
                borderRadius: 99,
                backgroundColor: isRecording ? '#b22222' : '#05998c',
              }}
            >
              <Ionicons name={'mic'} size={20} color={'#fff'} />
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => sendMessage(text)}
            disabled={!text.trim()}
            style={{
              padding: 8,
              borderRadius: 99,
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
