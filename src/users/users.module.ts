import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResolver } from './resolvers/user.resolver';
import { ModelsModule } from '../models';
import { UsersController } from './users.controller';

@Module({
  imports: [ModelsModule],
  providers: [UsersService, UserResolver],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
