import { Document } from 'mongoose';

interface UserCommon {
  readonly email: string;
  readonly profile: { name: string; github_username: string; avatar: string };
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface UserDocument extends UserCommon, Document {
  readonly _id: string;
}

export interface User extends UserCommon {
  readonly id: string;
}
