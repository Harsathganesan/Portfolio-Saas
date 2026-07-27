import mongoose from 'mongoose';

export let isInMemoryFallback = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    isInMemoryFallback = false;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.warn(`👉 Switching to memory-fallback mode so the SaaS application runs seamlessly!`);
    isInMemoryFallback = true;
  }
};

export default connectDB;
