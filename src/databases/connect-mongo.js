import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/client-tracker';

export async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB:', MONGO_URL);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

export async function disconnectMongo() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection error:', error.message);
  }
}

