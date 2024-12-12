import { createParamDecorator, ExecutionContext } from '@nestjs/common';

class AuthTokenPayload {
  sub!: number;
  handle!: string;
  displayName!: string;
  iat!: number;
  exp!: number;
}

export class AuthUser {
  id: number;
  handle: string;
  displayName: string;

  public constructor(payload: AuthTokenPayload) {
    this.id = payload.sub;
    this.handle = payload.handle;
    this.displayName = payload.displayName;
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
