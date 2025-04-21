import OpenAI from "openai";
import { ENV_CONFIG } from './env.config';



const openai = new OpenAI({
  apiKey: ENV_CONFIG.OPENAI_API_KEY,
});

export default openai;