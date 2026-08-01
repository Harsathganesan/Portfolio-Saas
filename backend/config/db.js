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

  const uri = process.env.MONGODB_URI;

  if (!uri || !uri.trim()) {
    console.error(`❌ MONGODB_URI environment variable is missing! Please configure MONGODB_URI in your .env file or Vercel Environment Variables.`);
    isInMemoryFallback = true;
    return;
  }

  isConnecting = true;
  console.log(`📡 Connecting to MongoDB Atlas...`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Atlas Connected Successfully: ${conn.connection.host}`);
    isInMemoryFallback = false;
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Failed: ${error.message}`);
    isInMemoryFallback = true;
    if (process.env.VERCEL) {
      console.error(
        `🚨 CRITICAL VERCEL ERROR: Failed to connect to MongoDB Atlas! Please verify MONGODB_URI in Vercel Dashboard and ensure 0.0.0.0/0 IP Access List is enabled in MongoDB Atlas.`
      );
    }
  } finally {
    isConnecting = false;
  }
};

export default connectDB;
