import * as mongoose from 'mongoose';
import * as shortid from 'shortid';

export const GroupSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    published: { type: Boolean, default: false },
    count: { type: Number, default: 0 },
    authorId: String,
    name: String,
  },
  { timestamps: true },
);
