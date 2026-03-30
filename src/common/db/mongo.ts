import "dotenv/config";
import { MongoClient, Db, Collection, type Document } from "mongodb";

const rawUri = process.env.MONGO_URI ?? process.env.DATABASE_URL;

if (!rawUri) {
  throw new Error(
    "Set MONGO_URI to a valid Mongo connection string (e.g. mongodb://localhost:27017/dbname or mongodb+srv://...)."
  );
}

const dbName = process.env.MONGO_DB ?? "app";
const mongoUri = rawUri as string;
const client = new MongoClient(mongoUri);

let dbPromise: Promise<Db> | null = null;

export const initMongo = async (): Promise<Db> => {
  if (!dbPromise) {
    dbPromise = client.connect().then((conn) => conn.db(dbName));
  }
  return dbPromise;
};

export const getCollection = async <T extends Document>(
  name: string
): Promise<Collection<T>> => {
  const db = await initMongo();
  return db.collection<T>(name);
};
