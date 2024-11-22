import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class PrivateUserDto {
  @ApiProperty({ nullable: false, type: 'number', example: 1 })
  public id: number;

  @ApiProperty({ nullable: false, type: 'string', example: 'chrscmpl' })
  public username: string;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'chrscmpl@example.com',
  })
  public email: string;

  public static fromUser(user: UserEntity): PrivateUserDto {
    const sanitizedUser = new PrivateUserDto();
    sanitizedUser.id = user.id;
    sanitizedUser.username = user.username;
    sanitizedUser.email = user.email;
    return sanitizedUser;
  }
}
