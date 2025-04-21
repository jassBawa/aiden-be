import express, { Handler, RequestHandler } from 'express';
import { AuthController } from '../controllers/auth.controller';


const router = express.Router();

// Register a new user
router.post('/register', AuthController.register as RequestHandler);

// Login user
router.post('/login', AuthController.login as RequestHandler);

export default router; 