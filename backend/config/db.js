import mongoose from 'mongoose';

export let isInMemoryFallback = false;
let isConnecting = false;

const connectDB = async () => {
  // If already connected to MongoDB Atlas, return immediately
  if (mongoose.connection.readyState === 1) {
    isInMemoryFallback = false;
    return;
  }

  if (isConnecting) {
    return;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn(`⚠️ MONGODB_URI environment variable is not defined.`);
      isInMemoryFallback = true;
      return;
    }

    isConnecting = true;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✅ MongoDB Atlas Connected Successfully: ${conn.connection.host}`);
    isInMemoryFallback = false;
  } catch (error) {
    console.error(`💥 MongoDB connection error: ${error.message}`);
    isInMemoryFallback = true;
  } finally {
    isConnecting = false;
  }
};

export default connectDB;
