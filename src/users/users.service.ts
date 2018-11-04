import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserDocument, User } from './interfaces/user.interface';
import { normalize } from '../util/normalize';
import { InjectModel } from '@nestjs/mongoose';
import * as shortid from 'shortid';

interface CreateOrUpdateOptions {
  name: string;
  github_username: string;
  email: string;
  avatar: string;
  test?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  @normalize()
  async createOrUpdate({
    name,
    github_username,
    email,
    avatar,
    test = false,
  }: CreateOrUpdateOptions): Promise<User> {
    return await this.userModel
      .findOneAndUpdate(
        {
          email,
        },
        test
          ? {
              _id: `test:${shortid.generate()}`,
              profile: { name, github_username, avatar },
            }
          : {
              profile: { name, github_username, avatar },
            },
        { setDefaultsOnInsert: true, upsert: true, new: true },
      )
      .lean()
      .exec();
  }

  @normalize()
  async find(userId: string): Promise<User> {
    return await this.userModel
      .findById(userId)
      .lean()
      .exec();
  }
}
