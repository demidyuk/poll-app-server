import { Document } from 'mongoose';

export interface User extends Document {
  readonly email: string;
  readonly profile: { name: string; github_username: string; avatar: string };
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
