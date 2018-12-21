import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/gql.guard';
import { GroupsService } from '../groups.service';
import { User } from '../../users/decorators/user.decorator';
import { GroupsErrors } from '../groups.errors';
import { PollsService } from '../../polls/polls.service';
import { CreateGroupDto, GetGroupDto, AddPollDto, RemovePollDto } from '../dto';

@Resolver('Group')
export class GroupResolver {
  constructor(
    private readonly groupService: GroupsService,
    private readonly pollsService: PollsService,
  ) {}

  @UseGuards(GqlAuthGuard(false))
  @Query('group')
  async group(@Args() { id }: GetGroupDto, @User() user) {
    const group = await this.groupService.find(user, id);
    if (!group) throw GroupsErrors.GROUP_NOT_FOUND(id);
    return group;
  }

  @ResolveProperty('polls')
  async polls(@Parent() { id }, @User() user) {
    const polls = await this.pollsService.getForGroup(id);
    return polls.map(p => p.obj);
  }

  @UseGuards(GqlAuthGuard())
  @Mutation('createGroup')
  async create(@Args() { name }: CreateGroupDto, @User() user) {
    const group = await this.groupService.create(user, name);
    return group;
  }

  @UseGuards(GqlAuthGuard())
  @Mutation('addPollToGroup')
  async addPoll(
    @Args('addPollInput') { groupId, pollId }: AddPollDto,
    @User() user,
  ) {
    return await this.groupService.addPoll(user, { groupId, pollId });
  }

  @UseGuards(GqlAuthGuard())
  @Mutation('removePollFromGroup')
  async removePoll(
    @Args('removePollInput') { groupId, pollId }: RemovePollDto,
    @User() user,
  ) {
    return await this.groupService.removePoll(user, { groupId, pollId });
  }

  @UseGuards(GqlAuthGuard())
  @Mutation('publishGroup')
  async publish(@Args() { id }: GetGroupDto, @User() user) {
    return await this.groupService.publish(user, id);
  }
}
