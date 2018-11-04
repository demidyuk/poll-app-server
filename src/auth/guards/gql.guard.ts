import { ExecutionContext, mixin } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationError } from 'apollo-server-errors';
import { JsonWebTokenError } from 'jsonwebtoken';

const GqlAuthGuardStrict = createGqlAuthGuard(true);
const GqlAuthGuardNotStrict = createGqlAuthGuard(false);

export const GqlAuthGuard = (strict: boolean = true) =>
  strict ? GqlAuthGuardStrict : GqlAuthGuardNotStrict;

function createGqlAuthGuard(strict: boolean) {
  return mixin(
    class extends AuthGuard('jwt') {
      getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
      }

      handleRequest(err, user, info) {
        if ((strict || info instanceof JsonWebTokenError) && (err || !user)) {
          throw err || new AuthenticationError('not authenticated');
        }
        return user || null;
      }
    },
  );
}
