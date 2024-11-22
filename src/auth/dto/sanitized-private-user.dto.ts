import { UserEntity } from 'src/users/entities/user.entity';

export class SanitizedPrivateUserDto {
  public id: number;
  public username: string;
  public email: string;

  public static fromUser(user: UserEntity): SanitizedPrivateUserDto {
    const sanitizedUser = new SanitizedPrivateUserDto();
    sanitizedUser.id = user.id;
    sanitizedUser.username = user.username;
    sanitizedUser.email = user.email;
    return sanitizedUser;
  }
}
