import {
  Args,
  Resolver,
  Query,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { UseGuards, Inject, forwardRef } from '@nestjs/common';
import { PollsService } from '../../polls/polls.service';
import { GroupsService } from '../../groups/groups.service';
import { UsersService } from '../users.service';
import { User } from '../decorators/user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql.guard';
import { GetUserDto } from '../dto';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => PollsService))
    private readonly pollsService: PollsService,
    private readonly groupService: GroupsService,
  ) {}

  @UseGuards(GqlAuthGuard(false))
  @Query('user')
  async user(@Args() { id }: GetUserDto, @User() user) {
    if (id) {
      return await this.usersService.find(id);
    } else if (user) {
      return await this.usersService.find(user.id);
    }
  }

  @ResolveProperty('email')
  async email(@Parent() { id, email }, @User() user) {
    if (user && id === user.id) {
      return email;
    }
  }

  @ResolveProperty('polls')
  async polls(@Parent() { id }, @User() user) {
    const polls = await this.pollsService.getForUser(user, id);
    return polls.map(p => p.obj);
  }

  @ResolveProperty('groups')
  async groups(@Parent() { id }, @User() user) {
    return await this.groupService.getForUser(user, id);
  }
}
