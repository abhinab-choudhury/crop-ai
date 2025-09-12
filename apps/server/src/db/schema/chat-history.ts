import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  message: String,
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'file', 'audio', 'sticker', 'emoji'], // Different types of content
    required: true,
  },
  content: {},
});

const chatHistorySchema = new mongoose.Schema(
  {
    userId: String,
    chatContent: Array<Object>,
  },
  {
    timestamps: true,
  },
);

const ChatHistoryModel = mongoose.model('ChatHistory', chatHistorySchema);
export default ChatHistoryModel;
