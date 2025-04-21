import mongoose from 'mongoose';
import {ENV_CONFIG} from './env.config';

const MONGODB_URI = ENV_CONFIG.MONGODB_URI

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {});
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Exit with failure
  }
};
