import * as mongoose from 'mongoose';

export const VoteSchema = new mongoose.Schema({
  pollId: String,
  optionId: String,
  bucket: Number,
  count: { type: Number, default: 0 },
  votes: [
    {
      _id: false,
      userId: { type: String, index: true },
      votedAt: { type: Date, default: Date.now },
    },
  ],
}).index({ pollId: 1, optionId: 1, bucket: 1 });
