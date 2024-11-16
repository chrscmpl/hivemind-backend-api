import { AuthGuard } from '@nestjs/passport';

export class OptionalAuthGuard extends AuthGuard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handleRequest(err: any, user: any) {
    if (err || !user) {
      return null;
    }
    return user;
  }
}
