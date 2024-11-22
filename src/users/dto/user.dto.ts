import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserDto {
  @ApiProperty({ nullable: false, type: 'number', example: 1 })
  id: number;

  @ApiProperty({ nullable: false, type: 'string', example: 'chrscmpl' })
  username: string;

  public static fromUser(user: UserEntity): UserDto {
    const publicUser = new UserDto();
    publicUser.id = user.id;
    publicUser.username = user.username;
    return publicUser;
  }
}
