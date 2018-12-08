import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PollsService } from '../polls/polls.service';
import { Poll, User, Group } from '../models';

interface AddPollOptions {
  groupId: string;
  pollId: string;
}

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel('Group') private readonly groupModel: Model<Group>,
    @InjectModel('Poll') private readonly pollModel: Model<Poll>,
    private readonly pollsService: PollsService,
  ) {}

  async find(user: User, groupId: string): Promise<Group> {
    const group = await this.groupModel.findById(groupId);
    if (group) {
      if (group.published === true) {
        return group;
      } else if (group.published === false && group.authorId === user.id) {
        return group;
      }
    }
    return null;
  }

  async create(user: User, name: string): Promise<Group> {
    const group = new this.groupModel({ name, authorId: user.id });
    return await group.save();
  }

  async publish(user: User, groupId: string): Promise<boolean> {
    const group = await this.find(user, groupId);
    if (group && !group.published && group.count > 0) {
      await this.pollModel.updateMany(
        { groupId },
        {
          published: true,
        },
      );
      await this.groupModel.updateOne(
        { _id: groupId, published: false },
        {
          published: true,
        },
      );
      return true;
    }
    return false;
  }

  async addPoll(
    user: User,
    { groupId, pollId }: AddPollOptions,
  ): Promise<boolean> {
    const group = await this.find(user, groupId);
    const poll = await this.pollsService.find(user, pollId);
    if (!(group && !group.published && group.count < 10)) {
      return false;
    }
    if (!(poll && !poll.published && !poll.groupId)) {
      return false;
    }
    const result = await this.groupModel.updateOne(
      { _id: groupId, count: group.count },
      {
        $inc: { count: 1 },
      },
    );
    if (result.n) {
      await this.pollModel.updateOne(
        { _id: pollId },
        {
          $set: { groupId },
        },
      );
      return true;
    }
    return false;
  }

  async getForUser(user: User, userId: string): Promise<Group[]> {
    let query = { authorId: user.id };
    if (!(user && user.id === userId)) {
      query = Object.assign(query, { published: true });
    }
    return await this.groupModel
      .find(query)
      .sort([['createdAt', -1]])
      .limit(20);
  }
}
