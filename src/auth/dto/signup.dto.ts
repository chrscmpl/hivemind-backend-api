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
    minLength: 6,
    maxLength: 20,
  })
  @Length(6, 20)
  @Matches(/^[a-zA-Z0-9_]*$/, {
    message: 'username must contain only letters, numbers, and underscores',
  })
  username: string;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'examplePassword22?',
    minLength: 8,
    maxLength: 32,
  })
  @Length(8, 32)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).*$/, {
    message:
      'password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
  })
  password: string;
}
