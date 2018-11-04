import * as mongoose from 'mongoose';
import * as shortid from 'shortid';

export const PollSchema = new mongoose.Schema(
  {
    _id: { type: String, default: shortid.generate },
    question: String,
    authorId: String,
    options: [
      {
        _id: false,
        id: {
          type: String,
          default: shortid.generate,
        },
        num_buckets: { type: Number, default: 0 },
        value: String,
      },
    ],
  },
  { timestamps: true },
);
