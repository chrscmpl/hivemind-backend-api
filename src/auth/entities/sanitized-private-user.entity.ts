import { User } from 'src/users/entities/user.entity';

export class SanitizedPrivateUser {
  public id: number;
  public username: string;
  public email: string;

  public static fromUser(user: User): SanitizedPrivateUser {
    const sanitizedUser = new SanitizedPrivateUser();
    sanitizedUser.id = user.id;
    sanitizedUser.username = user.username;
    sanitizedUser.email = user.email;
    return sanitizedUser;
  }
}
