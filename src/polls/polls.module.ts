import { Module } from '@nestjs/common';
import { PollResolver } from './resolvers/poll.resolver';
import { OptionResolver } from './resolvers/option.resolver';
import { PollsService } from './polls.service';
import { VotesLoader } from './loaders/votes.loader';
import { UsersModule } from '../users/users.module';
import { ModelsModule } from '../models';

@Module({
  imports: [ModelsModule, UsersModule],
  providers: [PollsService, VotesLoader, PollResolver, OptionResolver],
  exports: [VotesLoader],
})
export class PollsModule {}
