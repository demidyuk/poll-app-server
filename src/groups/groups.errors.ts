import { ApolloError } from 'apollo-server-core';

export class GroupsErrors {
  public static GROUP_NOT_FOUND(group: string): ApolloError {
    return new ApolloError(
      `cannot find group: ${group}`,
      GroupsErrors.GROUP_NOT_FOUND.name,
    );
  }
}
