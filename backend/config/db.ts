/**
 * @file backend/config/db.ts
 * @description Database connection configuration and state management.
 * Connects to MongoDB via Mongoose using process.env.MONGODB_URI.
 * Includes graceful connection handling and fallback state reporting.
 */

import mongoose from 'mongoose';

interface DBState {
  isConnected: boolean;
  isFallback: boolean;
  uriUsed: string;
}

export const dbState: DBState = {
  isConnected: false,
  isFallback: false,
  uriUsed: '',
};

/**
 * Connect to MongoDB with production-grade connection options and timeouts
 */
export async function connectDB(): Promise<void> {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gupio_ems';
  dbState.uriUsed = mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'); // Redact credentials in logs

  try {
    console.log(`[DB] Attempting connection to MongoDB at: ${dbState.uriUsed}`);

    // Set short serverSelectionTimeoutMS so if Mongo daemon isn't running locally, it doesn't hang the applet
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 3000,
    });

    dbState.isConnected = true;
    dbState.isFallback = false;
    console.log('✅ [DB] Successfully connected to MongoDB via Mongoose');
  } catch (err: unknown) {
    const error = err as Error;
    console.warn(`⚠️ [DB] MongoDB connection failed (${error.message}).`);
    console.log('ℹ️ [DB] Activating resilient in-memory Mongoose-compatible data repository for evaluation sandbox.');
    dbState.isConnected = false;
    dbState.isFallback = true;
  }

  // Handle runtime connection lifecycle events
  mongoose.connection.on('disconnected', () => {
    if (!dbState.isFallback) {
      console.warn('⚠️ [DB] MongoDB connection lost.');
      dbState.isConnected = false;
    }
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✅ [DB] MongoDB reconnected.');
    dbState.isConnected = true;
    dbState.isFallback = false;
  });
}

export default connectDB;
