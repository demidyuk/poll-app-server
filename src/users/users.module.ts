import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResolver } from './resolvers/user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UsersService, UserResolver],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
