import express from 'express';
import { auth } from '../middleware/auth';
import { ChatController } from '../controllers/chat.controller';
import { globalRateLimiter } from '../config/rate-limit.config';

const router = express.Router();

// chat middlewares
router.use(auth);
router.use(globalRateLimiter);

/**
 * @swagger
 * openapi: 3.0.0
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * tags:
 *   name: Chat
 *   description: Chat-related endpoints for interacting with the assistant
 */

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Create a new chat and get AI response
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chat created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 conversationId:
 *                   type: string
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     remainingTokens:
 *                       type: number
 *                     tokensUsed:
 *                       type: number
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Insufficient token balance
 *       500:
 *         description: Internal server error
 */
router.post('/chat', ChatController.createChat);

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Get all conversations for the authenticated user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       lastMessage:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
router.get('/chats', ChatController.getAllChats);

/**
 * @swagger
 * /api/chat/{id}:
 *   get:
 *     summary: Get a specific chat by ID
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the chat to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Internal server error
 */
router.get('/chat/:id', ChatController.getChat);

export default router;
