import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      default: '',
    },
    profilePhoto: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
