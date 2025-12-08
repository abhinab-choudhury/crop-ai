export type Message = {
  id: string;
  type: 'text' | 'image' | 'audio';
  content: string;
  sender: 'user' | 'bot';
};
