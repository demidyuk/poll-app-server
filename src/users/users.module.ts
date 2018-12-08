import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResolver } from './resolvers/user.resolver';
import { PollsModule } from '../polls/polls.module';
import { GroupsModule } from '../groups/groups.module';
import { ModelsModule } from '../models';
import { UsersController } from './users.controller';

@Module({
  imports: [ModelsModule, forwardRef(() => PollsModule), GroupsModule],
  providers: [UsersService, UserResolver],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
