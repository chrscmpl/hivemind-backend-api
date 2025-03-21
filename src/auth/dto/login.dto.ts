import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'example@email.com',
  })
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'examplePassword22?',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
