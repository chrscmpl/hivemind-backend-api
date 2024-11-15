import { createParamDecorator } from '@nestjs/common';
import { AuthTokenPayload } from '../dto/auth-token-payload.dto';
import { AuthenticatedUser } from '../entities/authenticated-user.entity';

// Req.user is set by the AuthenticationGuard
export const AuthUser = createParamDecorator((_, context) => {
  const user = context.switchToHttp().getRequest().user as
    | AuthTokenPayload
    | null
    | undefined;

  if (!user) {
    if (user === undefined) {
      throw new Error('@AuthUser needs AuthGuard to function');
    }
    return user;
  }

  return AuthenticatedUser.fromPayload(user);
});
