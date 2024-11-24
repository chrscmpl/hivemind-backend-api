import { ApiProperty } from '@nestjs/swagger';

export class BadRequestExceptionDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'Bad Request',
  })
  public message: string;

  @ApiProperty({
    nullable: false,
    type: 'number',
    example: 400,
  })
  public statusCode: number;
}
