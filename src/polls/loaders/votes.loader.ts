import { Injectable } from '@nestjs/common';
import { PollsService } from '../polls.service';
import DataLoader = require('dataloader');

@Injectable()
export class VotesLoader {
  constructor(private readonly pollsService: PollsService) {}

  create() {
    return new DataLoader(this.getVotes.bind(this));
  }

  private async getVotes([pollId]) {
    return [await this.pollsService.getResults(pollId)];
  }
}
