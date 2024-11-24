import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenExceptionDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'Forbidden',
  })
  public message: string;

  @ApiProperty({
    nullable: false,
    type: 'number',
    example: 403,
  })
  public statusCode: number;
}
