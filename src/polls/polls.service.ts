import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PollsErrors } from './polls.errors';
import { PollDocument, Poll } from './interfaces/poll.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '../config/config.service';
import { normalize } from '../util/normalize';

@Injectable()
export class PollsService {
  private bucketCapacity: number;
  constructor(
    config: ConfigService,
    @InjectModel('Poll') private readonly pollModel: Model<PollDocument>,
    @InjectModel('Vote') private readonly voteModel: Model<any>,
  ) {
    this.bucketCapacity = config.bucketCapacity;
  }

  @normalize()
  async create(
    authorId: string,
    question: string,
    options: { value: string }[],
  ): Promise<Poll> {
    const poll = new this.pollModel({ authorId, question, options });
    return (await poll.save()).toObject();
  }

  @normalize()
  async find(pollId: string): Promise<Poll> {
    return await this.pollModel
      .findById(pollId)
      .lean()
      .exec();
  }

  async getAnswer(pollId: string, userId: string): Promise<string> {
    const [option] = await this.voteModel
      .aggregate([
        {
          $match: {
            pollId,
            'votes.userId': userId,
          },
        },
        {
          $project: { _id: '$optionId' },
        },
      ])
      .exec();
    return option ? option._id : null;
  }

  async hasUserVoted(pollId: string, userId: string): Promise<boolean> {
    const results = await this.voteModel
      .aggregate([
        {
          $match: {
            pollId,
            'votes.userId': userId,
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

  async findOption(
    pollId: string,
    optionId: string,
  ): Promise<{ id: string; value: string; num_buckets: number }> {
    const [option] = await this.pollModel
      .aggregate([
        { $match: { _id: pollId } },
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
      ])
      .exec();
    return option;
  }

  async vote(
    userId: string,
    pollId: string,
    optionId: string,
  ): Promise<number> {
    const option = await this.findOption(pollId, optionId);

    if (!option) throw PollsErrors.OPTION_NOT_FOUND(pollId + '.' + optionId);

    const bucket = option.num_buckets;

    if (!(await this.hasUserVoted(pollId, userId))) {
      const { count } = await this.voteModel
        .findOneAndUpdate(
          {
            pollId,
            optionId,
            bucket,
          },
          {
            $inc: { count: 1 },
            $push: { votes: { userId } },
          },
          {
            fields: { _id: 0, count: 1 },
            upsert: true,
            new: true,
          },
        )
        .exec();

      if (count >= this.bucketCapacity) {
        await this.pollModel
          .updateOne(
            {
              pollId,
              options: { $elemMatch: { id: optionId, num_buckets: bucket } },
            },
            { $inc: { 'options.$.num_buckets': 1 } },
          )
          .exec();
      }
      return count;
    } else throw PollsErrors.ALREADY_VOTED();
  }
}
