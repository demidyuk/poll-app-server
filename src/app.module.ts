import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PollsModule } from './polls/polls.module';
import { GraphQLModule } from '@nestjs/graphql';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsFilter } from './exception.filter';
import { VotesLoader } from './polls/loaders/votes.loader';
import { ConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DevGuard } from './dev.guard';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        uri: config.mongoUri,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PollsModule,
    GraphQLModule.forRootAsync({
      imports: [PollsModule],
      useFactory: async (config: ConfigService, votesLoader: VotesLoader) => ({
        context: ({ req }) => ({ req, votesLoader: votesLoader.create() }),
        path: '/api/graphql',
        playground: config.isDev,
        typePaths: ['./**/*.graphql'],
        debug: true,
        formatError: error => ({
          message: error.message,
          extensions: error.extensions,
        }),
      }),
      inject: [ConfigService, VotesLoader],
    }),
    DevGuard,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})
export class AppModule {}
