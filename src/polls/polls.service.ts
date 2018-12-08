import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PollsErrors } from './polls.errors';
import { Poll, User } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '../config/config.service';
import { normalize } from '../util/normalize';

interface CreatePollOptions {
  question: string;
  options: { value: string }[];
}

interface UpdatePollOptions extends CreatePollOptions {
  pollId: string;
}

interface VoteOptions {
  pollId: string;
  optionId: string;
}

interface Option {
  id: string;
  value: string;
  num_buckets: number;
}

@Injectable()
export class PollsService {
  private bucketCapacity: number;
  constructor(
    { bucketCapacity }: ConfigService,
    @InjectModel('Poll') private readonly pollModel: Model<Poll>,
    @InjectModel('Vote') private readonly voteModel: Model<any>,
  ) {
    this.bucketCapacity = bucketCapacity;
  }

  async create(
    user: User,
    { question, options }: CreatePollOptions,
  ): Promise<Poll> {
    const poll = new this.pollModel({ authorId: user.id, question, options });
    return await poll.save();
  }

  async update(user: User, { pollId, question, options }: UpdatePollOptions) {
    const poll = await this.pollModel.findOneAndUpdate(
      { _id: pollId, authorId: user.id, published: false },
      { question, options },
      { new: true },
    );
    return poll;
  }

  async find(user: User, pollId: string): Promise<Poll> {
    const poll = await this.pollModel.findById(pollId);
    if (poll) {
      if (poll.published === true) {
        return poll;
      } else if (poll.published === false && poll.authorId === user.id) {
        return poll;
      }
    }
    return null;
  }

  async getForGroup(user: User, groupId: string) {
    return await this.pollModel.find({ authorId: user.id, groupId });
  }

  async getForUser(user: User, userId: string): Promise<Poll[]> {
    let query = { authorId: user.id, groupId: { $exists: false } };
    if (!(user && user.id === userId)) {
      query = Object.assign(query, { published: true });
    }
    return await this.pollModel
      .find(query)
      .sort([['createdAt', -1]])
      .limit(20);
  }

  async publish(user: User, pollIds: [string]) {
    const result = await this.pollModel.updateMany(
      {
        _id: { $in: pollIds },
        authorId: user.id,
        published: false,
        groupId: { $exists: false },
      },
      {
        published: true,
      },
    );
    return !!result.nModified;
  }

  async getAnswer(user: User, pollId: string): Promise<string> {
    const [option] = await this.voteModel.aggregate([
      {
        $match: {
          pollId,
          'votes.userId': user.id,
        },
      },
      {
        $project: { _id: '$optionId' },
      },
    ]);
    return option ? option._id : null;
  }

  private async hasUserVoted(user: User, pollId: string): Promise<boolean> {
    const results = await this.voteModel
      .aggregate([
        {
          $match: {
            pollId,
            'votes.userId': user.id,
          },
        },
        {
          $count: 'c',
        },
      ])
      .exec();
    return results.length === 1;
  }

  @normalize()
  async getResults(pollId: string): Promise<{ id: string; votes: number }[]> {
    return await this.voteModel
      .aggregate([
        {
          $match: { pollId },
        },
        {
          $group: {
            _id: '$optionId',
            votes: { $sum: '$count' },
          },
        },
      ])
      .exec();
  }

  private async findOption(pollId: string, optionId: string): Promise<Option> {
    const [option] = await this.pollModel.aggregate([
      { $match: { _id: pollId, published: true } },
      { $unwind: '$options' },
      { $match: { 'options.id': optionId } },
      {
        $project: {
          _id: 0,
          id: '$options.id',
          value: '$options.value',
          num_buckets: '$options.num_buckets',
        },
      },
    ]);
    return option;
  }

  async vote(user: User, { pollId, optionId }: VoteOptions): Promise<number> {
    const option = await this.findOption(pollId, optionId);

    if (!option) throw PollsErrors.OPTION_NOT_FOUND(pollId + '.' + optionId);

    const bucket = option.num_buckets;

    if (!(await this.hasUserVoted(user, pollId))) {
      const { count } = await this.voteModel.findOneAndUpdate(
        {
          pollId,
          optionId,
          bucket,
        },
        {
          $inc: { count: 1 },
          $push: { votes: { userId: user.id } },
        },
        {
          fields: { _id: 0, count: 1 },
          upsert: true,
          new: true,
        },
      );

      if (count >= this.bucketCapacity) {
        await this.pollModel.updateOne(
          {
            pollId,
            options: { $elemMatch: { id: optionId, num_buckets: bucket } },
          },
          { $inc: { 'options.$.num_buckets': 1 } },
        );
      }
      return count;
    } else throw PollsErrors.ALREADY_VOTED();
  }
}
