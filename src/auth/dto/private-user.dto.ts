import { ApiProperty } from '@nestjs/swagger';
import { noMsIso } from 'src/common/helpers/no-ms-iso.helper';
import { UserEntity } from 'src/users/entities/user.entity';

export class PrivateUserDto {
  @ApiProperty({ nullable: false, type: 'number', example: 1 })
  public id: number;

  @ApiProperty({ nullable: false, type: 'string', example: 'smith97' })
  public handle: string;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'John Smith',
  })
  public displayName: string;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'example@email.com',
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
    this.handle = user.handle;
    this.displayName = user.displayName;
    this.email = user.email;
    this.createdAt = noMsIso(user.createdAt);
    this.updatedAt = noMsIso(user.updatedAt);
  }
}
