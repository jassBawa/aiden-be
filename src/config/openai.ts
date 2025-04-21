import dotenv from 'dotenv';
import OpenAI from "openai";
import { ENV_CONFIG } from './env.config';

dotenv.config();

const openai = new OpenAI({
  apiKey: ENV_CONFIG.OPENAI_API_KEY,
});

export default openai;