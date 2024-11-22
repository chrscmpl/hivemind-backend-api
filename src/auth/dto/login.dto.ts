import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'chrscmpl@example.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'examplePassword22?',
  })
  @IsNotEmpty()
  password: string;
}
