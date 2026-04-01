import mongoose, { type Model } from "mongoose";
import type { IUser } from "../domain/user.interface";

// This schema describes how users are stored in MongoDB.
const userSchema = new mongoose.Schema<IUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: "users",
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

export const UserModel: Model<IUser> =
  // Reuse the compiled model in dev/hot-reload environments to avoid overwrite errors.
  (mongoose.models.User as Model<IUser> | undefined) ??
  mongoose.model<IUser>("User", userSchema);
