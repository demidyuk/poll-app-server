import { Module } from '@nestjs/common';
import { PollResolver } from './resolvers/poll.resolver';
import { OptionResolver } from './resolvers/option.resolver';
import { PollsService } from './polls.service';
import { VotesLoader } from './loaders/votes.loader';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PollSchema } from './schemas/poll.schema';
import { VoteSchema } from './schemas/vote.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Poll', schema: PollSchema },
      { name: 'Vote', schema: VoteSchema },
    ]),
    UsersModule,
  ],
  providers: [PollsService, VotesLoader, PollResolver, OptionResolver],
  exports: [VotesLoader],
})
export class PollsModule {}
