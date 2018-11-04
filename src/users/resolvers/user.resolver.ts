import {
  Args,
  Resolver,
  Query,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../decorators/user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql.guard';

@Resolver('User')
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthGuard(false))
  @Query()
  async user(@Args('id') id: string, @User() user) {
    if (id) {
      return await this.usersService.find(id);
    } else if (user) {
      return await this.usersService.find(user.id);
    }
  }

  @ResolveProperty()
  async email(@Parent() { id, email }, @User() user) {
    if (user && id === user.id) {
      return email;
    }
  }
}
