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
import { PollsService } from '../polls.service';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/decorators/user.decorator';
import { PollsErrors } from '../polls.errors';

@Resolver('Poll')
export class PollResolver {
  constructor(
    private readonly pollsService: PollsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(GqlAuthGuard(false))
  @Query()
  async poll(@Args('id') pollId: string) {
    const poll = await this.pollsService.find(pollId);
    if (!poll) throw PollsErrors.POLL_NOT_FOUND(pollId);
    return poll.obj;
  }

  @ResolveProperty()
  async answer(@Parent() { id }, @User() user) {
    if (user) {
      return await this.pollsService.getAnswer(id, user.id);
    }
  }

  @ResolveProperty()
  async author(@Parent() { authorId }) {
    return await this.usersService.find(authorId);
  }

  @UseGuards(GqlAuthGuard())
  @Mutation('createPoll')
  async create(@Args() { question, options }, @User() user) {
    const poll = await this.pollsService.create(user.id, question, options);
    return poll.obj;
  }

  @UseGuards(GqlAuthGuard())
  @Mutation('vote')
  async vote(@Args() { pollId, optionId }, @User() user) {
    return await this.pollsService.vote(user.id, pollId, optionId);
  }
}
