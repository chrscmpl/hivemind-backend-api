import { AuthTokenPayload } from '../dto/auth-token-payload.dto';

export class AuthUserEntity {
  id: number;
  username: string;

  public static fromPayload(payload: AuthTokenPayload): AuthUserEntity {
    const user = new AuthUserEntity();
    user.id = payload.sub;
    user.username = payload.username;
    return user;
  }
}
