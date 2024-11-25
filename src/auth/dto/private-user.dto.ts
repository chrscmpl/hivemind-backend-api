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

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: '2024-12-12T12:00:00Z',
  })
  public createdAt!: string;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: '2024-12-12T12:00:00Z',
  })
  public updatedAt!: string;

  public constructor(user: UserEntity) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.createdAt = `${user.createdAt.toISOString().split('.')[0]}Z`;
    this.updatedAt = `${user.updatedAt.toISOString().split('.')[0]}Z`;
  }
}
