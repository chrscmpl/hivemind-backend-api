import { createParamDecorator, ExecutionContext } from '@nestjs/common';

class AuthTokenPayload {
  sub: number;
  username: string;
  iat: number;
  exp: number;
}

export class AuthenticatedUser {
  id: number;
  username: string;

  public static fromPayload(payload: AuthTokenPayload): AuthenticatedUser {
    const user = new AuthenticatedUser();
    user.id = payload.sub;
    user.username = payload.username;
    return user;
  }
}

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

    return user ? AuthenticatedUser.fromPayload(user) : null;
  },
);
