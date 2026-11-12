import "server-only";
import mongoose from "mongoose";

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalForMongoose = globalThis as typeof globalThis & { mongooseCache?: MongooseCache };
const cache = globalForMongoose.mongooseCache ?? { conn: null, promise: null };
globalForMongoose.mongooseCache = cache;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured. Add it to .env.local before using the dashboard.");
  if (cache.conn) return cache.conn;
  if (!cache.promise) cache.promise = mongoose.connect(uri, { bufferCommands: false, maxPoolSize: 10, serverSelectionTimeoutMS: 10000 });
  try { cache.conn = await cache.promise; }
  catch (error) { cache.promise = null; throw error; }
  return cache.conn;
}
