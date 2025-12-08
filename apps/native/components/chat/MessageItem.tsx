import { View, Text, Image } from 'react-native';
import { Message } from '@/types/Message';
import botIcon from '@/assets/bot.png';
import AudioMessage from './AudioMessage';

export default function MessageItem({ item }: { item: Message }) {
  const isUser = item.sender === 'user';

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginVertical: 6,
      }}
    >
      {!isUser && <Image source={botIcon} style={{ width: 32, height: 32, marginRight: 8 }} />}

      <View
        style={{
          backgroundColor: isUser ? '#20C997' : '#E6F7F5',
          padding: 12,
          borderRadius: 16,
          maxWidth: '75%',
        }}
      >
        {item.type === 'text' && (
          <Text style={{ color: isUser ? '#fff' : '#004D40' }}>{item.content}</Text>
        )}

        {item.type === 'image' && (
          <Image source={{ uri: item.content }} style={{ width: 200, height: 200, marginTop: 8 }} />
        )}

        {item.type === 'audio' && <AudioMessage url={item.content} />}
      </View>
    </View>
  );
}
