import { UserSchema } from './schemas/user.schema';
import { PollSchema } from './schemas/poll.schema';
import { VoteSchema } from './schemas/vote.schema';
import { GroupSchema } from './schemas/group.schema';
import { MongooseModule } from '@nestjs/mongoose';

export const ModelsModule = MongooseModule.forFeature([
  { name: 'User', schema: UserSchema },
  { name: 'Poll', schema: PollSchema },
  { name: 'Vote', schema: VoteSchema },
  { name: 'Group', schema: GroupSchema },
]);
