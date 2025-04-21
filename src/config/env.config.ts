import {TiktokenModel} from "tiktoken";


export const ENV_CONFIG = {

  // Server Configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

// JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

// OpenAI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini' as TiktokenModel,

// Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app',

// Token Configuration
  INITIAL_TOKEN_BALANCE: parseInt(process.env.INITIAL_TOKEN_BALANCE || '1000', 10)
} as const; 