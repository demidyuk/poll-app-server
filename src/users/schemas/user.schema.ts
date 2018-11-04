import * as mongoose from 'mongoose';
import * as shortid from 'shortid';

export const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    email: { type: String, index: true },
    profile: {
      name: String,
      github_username: { type: String, index: true },
      avatar: String,
    },
  },
  { timestamps: true },
);
