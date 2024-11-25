import { ApiProperty } from '@nestjs/swagger';

export class ConflictExceptionDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'Conflict',
  })
  public message!: string;

  @ApiProperty({
    nullable: false,
    type: 'number',
    example: 409,
  })
  public statusCode!: number;
}
