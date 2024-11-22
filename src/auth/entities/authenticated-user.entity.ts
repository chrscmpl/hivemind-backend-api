import { AuthTokenPayload } from '../dto/auth-token-payload.dto';
import { UserEntity } from '../../users/entities/user.entity';

export class AuthenticatedUser {
  id: number;
  username: string;

  public static fromPayload(payload: AuthTokenPayload): AuthenticatedUser {
    const user = new AuthenticatedUser();
    user.id = payload.sub;
    user.username = payload.username;
    return user;
  }

  public static fromUser(user: UserEntity): AuthenticatedUser {
    const authUser = new AuthenticatedUser();
    authUser.id = user.id;
    authUser.username = user.username;
    return authUser;
  }
}
