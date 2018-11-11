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
import { CreatePollDto, GetPollDto, VoteDto } from '../dto';

@Resolver('Poll')
export class PollResolver {
  constructor(
    private readonly pollsService: PollsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(GqlAuthGuard(false))
  @Query()
  async poll(@Args() { id }: GetPollDto) {
    const poll = await this.pollsService.find(id);
    if (!poll) throw PollsErrors.POLL_NOT_FOUND(id);
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
  async create(@Args() { question, options }: CreatePollDto, @User() user) {
    const poll = await this.pollsService.create(user.id, question, options);
    return poll.obj;
  }

  @UseGuards(GqlAuthGuard())
  @Mutation('vote')
  async vote(@Args() { pollId, optionId }: VoteDto, @User() user) {
    return await this.pollsService.vote(user.id, pollId, optionId);
  }
}
