import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupResolver } from './resolvers/group.resolver';
import { ModelsModule } from '../models';
import { PollsModule } from '../polls/polls.module';

@Module({
  imports: [ModelsModule, PollsModule],
  providers: [GroupsService, GroupResolver],
  exports: [GroupsService],
})
export class GroupsModule {}
