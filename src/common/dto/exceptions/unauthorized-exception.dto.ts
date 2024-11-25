import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedExceptionDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'Unauthorized',
  })
  public message!: string;

  @ApiProperty({
    nullable: false,
    type: 'number',
    example: 401,
  })
  public statusCode!: number;
}
