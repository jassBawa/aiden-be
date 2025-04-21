import { TiktokenModel } from 'tiktoken';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('❌ OPENAI_API_KEY is missing in environment variables.');
}

if (!process.env.MONGODB_URI) {
  throw new Error('❌ Missing required environment variable: MONGODB_URI');
}

export const ENV_CONFIG = {
  // Server Configuration
  PORT:
    process.env.PORT || (process.env.NODE_ENV === 'production' ? '80' : '3000'),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

  // OpenAI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || ('gpt-4o-mini' as TiktokenModel),

  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI,

  // Token Configuration
  INITIAL_TOKEN_BALANCE: parseInt(
    process.env.INITIAL_TOKEN_BALANCE || '100000',
    10
  ),

  // Production-specific configurations
  PROD_API_URL:
    process.env.NODE_ENV === 'production'
      ? process.env.PROD_API_URL
      : `http://localhost:${process.env.PORT}`,
} as const;
