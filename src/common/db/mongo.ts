import "dotenv/config";
import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI ?? process.env.DATABASE_URL;
const dbName = process.env.MONGO_DB;

if (!mongoUri) {
  throw new Error(
    "Set MONGO_URI to a valid Mongo connection string (e.g. mongodb://localhost:27017/dbname or mongodb+srv://...)."
  );
}

let connectionPromise: Promise<typeof mongoose> | null = null;

export const initMongo = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  connectionPromise ??= mongoose.connect(
    mongoUri,
    dbName ? { dbName } : undefined
  );

  return connectionPromise;
};
