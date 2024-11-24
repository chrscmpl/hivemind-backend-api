import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthTokenPayload } from '../dto/auth-token-payload.dto';
import { AuthUserEntity } from '../entities/auth-user.entity';

// Req.user is set by AuthGuard
export const AuthUser = createParamDecorator(
  (data: { nullable?: boolean } = {}, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user as
      | AuthTokenPayload
      | null
      | undefined;

    if (!user && !data.nullable) {
      throw new Error('@AuthUser: Unexpected null or undefined user');
    }

    return user ? AuthUserEntity.fromPayload(user) : null;
  },
);
