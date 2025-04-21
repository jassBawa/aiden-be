import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
  user: mongoose.Types.ObjectId;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    tokens?: number;
  }[];
  lastMessage: string;
  createdAt: Date;
  updatedAt: Date;
  totalTokensUsed: number;
}

const chatSchema = new Schema<IChat>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tokens: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  lastMessage: {
    type: String,
    required: true,
  },
  totalTokensUsed: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
chatSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Chat = mongoose.model<IChat>('Chat', chatSchema); 