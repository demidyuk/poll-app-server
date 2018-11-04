import { Resolver, Context, ResolveProperty, Parent } from '@nestjs/graphql';

@Resolver('Option')
export class OptionResolver {
  @ResolveProperty()
  async votes(@Parent() { id, pollId }, @Context() context) {
    const result = (await context.votesLoader.load(pollId)).find(
      option => option.id === id,
    );
    return result ? result.votes : 0;
  }
}
