import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { UseGuards, Inject, forwardRef } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/gql.guard';
import { PollsService } from '../polls.service';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/decorators/user.decorator';
import { PollsErrors } from '../polls.errors';
import { CreatePollDto, UpdatePollDto, GetPollDto, VoteDto } from '../dto';

@Resolver('Poll')
export class PollResolver {
  constructor(
    private readonly pollsService: PollsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(GqlAuthGuard(false))
  @Query('poll')
  async poll(@Args() { id }: GetPollDto, @User() user) {
    const poll = await this.pollsService.find(user, id);
    if (!poll) throw PollsErrors.POLL_NOT_FOUND(id);
    return poll.obj;
  }

  @ResolveProperty('answer')
  async answer(@Parent() { id }, @User() user) {
    if (user) {
      return await this.pollsService.getAnswer(user, id);
    }
  }

  @ResolveProperty('author')
  async author(@Parent() { authorId }) {
    return await this.usersService.find(authorId);
  }

  @UseGuards(GqlAuthGuard())
  @Mutation('publishPoll')
  async publish(@Args() { id }: GetPollDto, @User() user) {
    return await this.pollsService.publish(user, [id]);
  }

  @UseGuards(GqlAuthGuard())
  @Mutation('createPoll')
  async create(
    @Args('createPollInput') { question, options }: CreatePollDto,
    @User() user,
  ) {
    const poll = await this.pollsService.create(user, { question, options });
    return poll.obj;
  }

  @UseGuards(GqlAuthGuard())
  @Mutation('updatePoll')
  async update(
    @Args('updatePollInput') { id, question, options }: UpdatePollDto,
    @User() user,
  ) {
    const poll = await this.pollsService.update(user, {
      pollId: id,
      question,
      options,
    });
    return poll ? poll.obj : poll;
  }

  @UseGuards(GqlAuthGuard())
  @Mutation('vote')
  async vote(@Args('voteInput') { pollId, optionId }: VoteDto, @User() user) {
    return await this.pollsService.vote(user, { pollId, optionId });
  }
}
