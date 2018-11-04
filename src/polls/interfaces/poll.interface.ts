import { Document } from 'mongoose';

interface PollCommon {
  readonly question: string;
  readonly authorId: string;
  readonly options: { id: string; value: string; num_buckets: number }[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
export interface PollDocument extends PollCommon, Document {
  readonly _id: string;
}

export interface Poll extends PollCommon {
  readonly id: string;
}
