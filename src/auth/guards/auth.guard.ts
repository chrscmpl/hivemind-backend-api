// eslint-disable-next-line no-restricted-imports
import { AuthGuard as AuthenticationGuard } from '@nestjs/passport';

interface AuthGuardOptions {
  required: boolean;
}

class _AuthGuard extends AuthenticationGuard('jwt') {}

// used to fill req.user if the token is present
// but does not actually enforce authentication
class _OptionalAuthGuard extends _AuthGuard {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handleRequest(err: any, user: any) {
    if (err || !user) {
      return null;
    }
    return user;
  }
}

export function AuthGuard(options: AuthGuardOptions = { required: true }) {
  return options.required ? _AuthGuard : _OptionalAuthGuard;
}
