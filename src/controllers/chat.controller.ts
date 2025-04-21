import { Request, Response } from 'express';
import { Chat } from '../models/Chat';
import { User } from '../models/User';
import openai from '../config/openai';
import { encoding_for_model, TiktokenModel } from 'tiktoken';
import { HTTP_STATUS } from '../constants/http-status-codes';
import { ERROR_MESSAGES } from '../constants/error-messages';
import { ENV_CONFIG } from '../config/env.config';

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

export class ChatController {
  static async getAllChats(req: AuthRequest, res: Response) {
    try {
      const chats = await Chat.find({
        user: req.user?._id,
      })
        .sort({ updatedAt: -1 })
        .select('_id lastMessage updatedAt');
      res.json({ conversations: chats });
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  static async createChat(req: AuthRequest, res: Response) {
    try {
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.INVALID_INPUT });
        return;
      }

      const user = await User.findById(req.user?._id);
      if (!user) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ error: ERROR_MESSAGES.NOT_FOUND });
        return;
      }

      const userMessageTokens = calculateTokens(message);

      if (user.tokenBalance < userMessageTokens) {
        res.status(HTTP_STATUS.FORBIDDEN).json({
          error: ERROR_MESSAGES.INSUFFICIENT_TOKENS,
          estimatedRequiredTokens: userMessageTokens,
          remainingTokens: user.tokenBalance,
        });
        return;
      }

      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: message }],
        model: ENV_CONFIG.OPENAI_MODEL,
      });

      const aiResponse = completion.choices[0].message.content;

      user.tokenBalance -= userMessageTokens;
      await user.save();

      const chat = new Chat({
        user: req.user?._id,
        lastMessage: message.substring(0, 50),
        messages: [
          { role: 'user', content: message, timestamp: new Date() },
          {
            role: 'assistant',
            content: aiResponse || '',
            timestamp: new Date(),
          },
        ],
        totalTokensUsed: userMessageTokens,
      });

      await chat.save();

      res.status(HTTP_STATUS.CREATED).json({
        message: aiResponse,
        conversationId: chat._id,
        tokens: {
          remainingTokens: user.tokenBalance,
          tokensUsed: userMessageTokens,
        },
      });
      return;
    } catch (error: any) {
      console.error('Chat Error:', error);

      if (error.response?.status) {
        res.status(error.response.status).json({
          error: ERROR_MESSAGES.OPENAI_API_ERROR,
          details: error.response.data,
        });
        return;
      }

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        details:
          ENV_CONFIG.NODE_ENV === 'development' ? error.message : undefined,
      });
      return;
    }
  }

  static async getChat(req: AuthRequest, res: Response) {
    try {
      const chat = await Chat.findOne({
        _id: req.params.id,
        user: req.user?._id,
      });

      if (!chat) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ error: ERROR_MESSAGES.NOT_FOUND });
        return;
      }

      const user = await User.findById(req.user?._id).select('tokenBalance');

      res.json({
        ...chat.toObject(),
        currentTokenBalance: user?.tokenBalance,
      });
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
}

export function calculateTokens(text: string): number {
  const enc = encoding_for_model(ENV_CONFIG.OPENAI_MODEL as TiktokenModel);
  const tokenCount = enc.encode(text).length;
  enc.free();
  return tokenCount;
}
