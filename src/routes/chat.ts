import express from 'express';
import { auth } from '../middleware/auth';
import { ChatController } from '../controllers/chat.controller';
import { userRateLimiter } from '../config/rate-limit.config';

const router = express.Router();

// chat middlewares
router.use(auth);
router.use(userRateLimiter);

router.get('/chats', ChatController.getAllChats);
router.post('/chat', ChatController.createChat);
router.get('/chat/:id', ChatController.getChat);

export default router;
