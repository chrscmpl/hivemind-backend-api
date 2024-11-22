import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, Matches } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'chrscmpl@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'chrscmpl',
  })
  @Length(6, 20)
  username: string;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'examplePassword22?',
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,32}$/)
  password: string;
}
