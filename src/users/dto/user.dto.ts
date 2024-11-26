import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserDto {
  @ApiProperty({ nullable: false, type: 'number', example: 1 })
  id: number;

  @ApiProperty({ nullable: false, type: 'string', example: 'chrscmpl' })
  handle: string;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'Christian Campolongo',
  })
  displayName: string;

  public constructor(user: UserEntity) {
    this.id = user.id;
    this.handle = user.handle;
    this.displayName = user.displayName;
  }
}
