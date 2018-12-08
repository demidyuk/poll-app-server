import { Document } from 'mongoose';

export interface Poll extends Document {
  readonly question: string;
  readonly authorId: string;
  readonly groupId?: string;
  readonly published: boolean;
  readonly options: { id: string; value: string; num_buckets: number }[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly obj: any;
}
