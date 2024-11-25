import { ApiProperty } from '@nestjs/swagger';

export class NotFoundExceptionDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'Not Found',
  })
  public message!: string;

  @ApiProperty({
    nullable: false,
    type: 'number',
    example: 404,
  })
  public statusCode!: number;
}
