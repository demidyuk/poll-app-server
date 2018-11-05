import { UserSchema } from './schemas/user.schema';
import { PollSchema } from './schemas/poll.schema';
import { VoteSchema } from './schemas/vote.schema';
import { MongooseModule } from '@nestjs/mongoose';

export const ModelsModule = MongooseModule.forFeature([
  { name: 'User', schema: UserSchema },
  { name: 'Poll', schema: PollSchema },
  { name: 'Vote', schema: VoteSchema },
]);
