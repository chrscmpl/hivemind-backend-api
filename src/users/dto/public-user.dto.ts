import { UserEntity } from '../entities/user.entity';

export class PublicUserDto {
  id: number;
  username: string;

  public static fromUser(user: UserEntity): PublicUserDto {
    const publicUser = new PublicUserDto();
    publicUser.id = user.id;
    publicUser.username = user.username;
    return publicUser;
  }
}
