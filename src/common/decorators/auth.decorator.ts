import { createParamDecorator, ExecutionContext } from '@nestjs/common';

class AuthTokenPayload {
  sub!: number;
  iat!: number;
  exp!: number;
}

export class AuthUser {
  id: number;

  public constructor(payload: AuthTokenPayload) {
    this.id = payload.sub;
  }
}

// Req.user is set by AuthGuard
export const Auth = createParamDecorator(
  (data: { nullable?: boolean } = {}, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user as
      | AuthTokenPayload
      | null
      | undefined;

    if (!user && !data.nullable) {
      throw new Error('@AuthUser: Unexpected null or undefined user');
    }

    return user ? new AuthUser(user) : null;
  },
);
