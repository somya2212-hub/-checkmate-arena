import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/checkmate_arena';
  
  try {
    mongoose.set('strictQuery', false);
    // Try connecting with a 3.5-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3500,
    });
    console.log(`[Database] Connected to MongoDB at: ${uri}`);
  } catch (err) {
    console.warn(`[Database] Standard MongoDB connection failed (${err.message}). Starting MongoMemoryServer for standalone zero-config runtime...`);
    try {
      mongod = await MongoMemoryServer.create({
        instance: {
          dbName: 'checkmate_arena'
        }
      });
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to In-Memory MongoDB at: ${memoryUri}`);
    } catch (memErr) {
      console.error('[Database] Failed to start In-Memory MongoDB:', memErr);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};
