import { createParamDecorator, ExecutionContext } from '@nestjs/common';

class AuthTokenPayload {
  sub!: number;
  username!: string;
  iat!: number;
  exp!: number;
}

export class AuthenticatedUser {
  id: number;
  username: string;

  public constructor(payload: AuthTokenPayload) {
    this.id = payload.sub;
    this.username = payload.username;
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

    return user ? new AuthenticatedUser(user) : null;
  },
);
