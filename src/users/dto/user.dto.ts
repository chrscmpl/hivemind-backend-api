import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserDto {
  @ApiProperty({ nullable: false, type: 'number', example: 1 })
  id: number;

  @ApiProperty({ nullable: false, type: 'string', example: 'smith97' })
  handle: string;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'John Smith',
  })
  displayName: string;

  public constructor(user: UserEntity) {
    this.id = user.id;
    this.handle = user.handle;
    this.displayName = user.displayName;
  }
}
