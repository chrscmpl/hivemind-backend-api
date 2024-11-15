import { AuthTokenPayload } from '../dto/auth-token-payload.dto';

export class AuthenticatedUser {
  id: number;
  username: string;

  public static fromPayload(payload: AuthTokenPayload) {
    const user = new AuthenticatedUser();
    user.id = payload.sub;
    user.username = payload.username;
    return user;
  }
}
