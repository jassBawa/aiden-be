import { describe, it, beforeEach, vi, expect } from 'vitest';
import {
  ChatController,
  calculateTokens,
} from '../../src/controllers/chat.controller';
import { Chat } from '../../src/models/Chat';
import { User } from '../../src/models/User';
import openai from '../../src/config/openai';

import { ERROR_MESSAGES } from '../../src/constants/error-messages';

const mockRequest = (userId: string, body = {}, params = {}) =>
  ({
    user: { _id: userId },
    body,
    params,
  } as any);

const mockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('calculateTokens', () => {
  it('should calculate tokens from a string', () => {
    const text = 'Hello, how are you?';
    const tokens = calculateTokens(text);
    expect(typeof tokens).toBe('number');
    expect(tokens).toBeGreaterThan(0);
  });
});

describe('ChatController.getAllChats', () => {
  it('should return a list of chats for the user', async () => {
    const userId = 'mockUserId';
    const req = mockRequest(userId);
    const res = mockResponse();

    vi.spyOn(Chat, 'find').mockReturnValueOnce({
      sort: vi.fn().mockReturnThis(),
      select: vi
        .fn()
        .mockResolvedValue([
          { _id: 'chat1', lastMessage: 'Hi', updatedAt: new Date() },
        ]),
    } as any);

    await ChatController.getAllChats(req, res);
    expect(res.json).toHaveBeenCalledWith({
      conversations: [
        { _id: 'chat1', lastMessage: 'Hi', updatedAt: expect.any(Date) },
      ],
    });
  });
});

describe('ChatController.createChat', () => {
  const userId = 'mockUserId';

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should create a chat and deduct tokens', async () => {
    const req = mockRequest(userId, { message: 'Hello world' });
    const res = mockResponse();

    const mockUser = { _id: userId, tokenBalance: 100, save: vi.fn() };
    vi.spyOn(User, 'findById').mockResolvedValueOnce(mockUser as any);

    vi.spyOn(Chat.prototype, 'save').mockResolvedValueOnce({});

    vi.spyOn(openai.chat.completions, 'create').mockResolvedValueOnce({
      choices: [{ message: { content: 'Hello there!' } }],
    } as any);

    vi.spyOn(Chat, 'find').mockImplementation(
      () =>
        ({
          sort: () => ({
            select: async () => [],
          }),
        } as any)
    );

    await ChatController.createChat(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Hello there!',
        tokens: {
          remainingTokens: expect.any(Number),
          tokensUsed: expect.any(Number),
        },
      })
    );
  });

  it('should return error if user has insufficient tokens', async () => {
    const req = mockRequest(userId, { message: 'A long message...' });
    const res = mockResponse();

    vi.spyOn(User, 'findById').mockResolvedValueOnce({
      _id: userId,
      tokenBalance: 0,
    } as any);

    await ChatController.createChat(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: ERROR_MESSAGES.INSUFFICIENT_TOKENS,
      })
    );
  });
});


describe('ChatController.getChat', () => {
    it('should return the chat by id and user', async () => {
        const req = {
          user: { _id: 'user123' },
          params: { id: 'chat123' },
        } as any;
      
        const res = mockResponse();
      
        const mockChat = {
          toObject: () => ({
            _id: 'chat123',
            lastMessage: 'Hi',
            messages: [],
          }),
        };
      
        const mockUser = { tokenBalance: 50 };
      
        // Mock Chat.findOne
        vi.spyOn(Chat, 'findOne').mockResolvedValueOnce(mockChat as any);
      
        // Mock User.findById().select()
        vi.spyOn(User, 'findById').mockReturnValueOnce({
          select: vi.fn().mockResolvedValueOnce(mockUser),
        } as any);
      
        await ChatController.getChat(req, res);
      
        expect(res.json).toHaveBeenCalledWith({
          _id: 'chat123',
          lastMessage: 'Hi',
          messages: [],
          currentTokenBalance: 50,
        });
      });
  });