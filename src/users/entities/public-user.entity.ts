import { User } from './user.entity';

export class PublicUser {
  id: number;
  username: string;

  public static fromUser(user: User): PublicUser {
    const publicUser = new PublicUser();
    publicUser.id = user.id;
    publicUser.username = user.username;
    return publicUser;
  }
}
