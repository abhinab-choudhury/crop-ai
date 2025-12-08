import { useState, useCallback, useRef } from 'react';
import { Message } from '@/types/Message';
import api from '@/lib/axiosInstance';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef<any>(null);

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendRequest = useCallback(async (message: string, imageUri: string) => {
    setIsTyping(true);

    try {
      const res = await api.post('/api/chat', { message, image_uri: imageUri });
      const reply = res.data.data?.finalResponse ?? 'No response';

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'text',
          content: reply,
          sender: 'bot',
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'text',
          content: 'Server error.',
          sender: 'bot',
        },
      ]);
    } finally {
      setIsTyping(false);
      scrollToEnd();
    }
  }, []);

  const sendMessage = (text: string, imageUri: string | null) => {
    if (!text.trim() && !imageUri) return;

    if (text.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), type: 'text', content: text, sender: 'user' },
      ]);
    }

    if (imageUri) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), type: 'image', content: imageUri, sender: 'user' },
      ]);
    }

    sendRequest(text, imageUri || '');
  };

  return { messages, sendMessage, isTyping, flatListRef };
}
