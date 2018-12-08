import { Document } from 'mongoose';

export interface Group extends Document {
  published: boolean;
  count: number;
  authorId: string;
  name: string;
}
