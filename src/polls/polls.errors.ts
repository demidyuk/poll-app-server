import { ApolloError } from 'apollo-server-core';

export class PollsErrors {
  public static ALREADY_VOTED(): ApolloError {
    return new ApolloError(
      `you can't vote multiple times!`,
      PollsErrors.ALREADY_VOTED.name,
    );
  }

  public static POLL_NOT_FOUND(poll: string): ApolloError {
    return new ApolloError(
      `cannot find poll: ${poll}`,
      PollsErrors.POLL_NOT_FOUND.name,
    );
  }

  public static OPTION_NOT_FOUND(option: string): ApolloError {
    return new ApolloError(
      `cannot find option: ${option}`,
      PollsErrors.OPTION_NOT_FOUND.name,
    );
  }
}
