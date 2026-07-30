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
      console.warn(`⚠️ MONGODB_URI environment variable is not defined. Using in-memory fallback.`);
      isInMemoryFallback = true;
      return;
    }

    isConnecting = true;
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Atlas Connected Successfully: ${conn.connection.host}`);
      isInMemoryFallback = false;
      return;
    } catch (atlasErr) {
      console.warn(`⚠️ MongoDB Atlas connection skipped/rejected: ${atlasErr.message}`);
      console.log(`🔄 Attempting Local MongoDB fallback at mongodb://127.0.0.1:27017/portfolio_saas...`);
      
      try {
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/portfolio_saas', {
          serverSelectionTimeoutMS: 2000,
        });
        console.log(`✅ Connected to Local MongoDB: ${localConn.connection.host}`);
        isInMemoryFallback = false;
        return;
      } catch (localErr) {
        console.log(`ℹ️ Local MongoDB unavailable. Switching seamlessly to In-Memory Database Fallback.`);
        isInMemoryFallback = true;
        if (process.env.VERCEL) {
          console.error(`🚨 CRITICAL VERCEL ERROR: Database failed to connect to MongoDB Atlas! Serverless functions are stateless so in-memory fallback will not persist user registrations or logins. Please verify MONGODB_URI in Vercel Dashboard and ensure 0.0.0.0/0 IP Access List is enabled in MongoDB Atlas.`);
        }
      }
    }
  } catch (error) {
    console.error(`💥 Database connection error: ${error.message}`);
    isInMemoryFallback = true;
  } finally {
    isConnecting = false;
  }

};

export default connectDB;
