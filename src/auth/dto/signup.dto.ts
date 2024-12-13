import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import * as sanitizeHtml from 'sanitize-html';

export class SignupDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'chrscmpl@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'chrscmpl',
    minLength: 4,
    maxLength: 30,
  })
  @Transform(({ value }) => sanitizeHtml(value))
  @IsNotEmpty()
  @IsString()
  @Length(4, 30)
  @Matches(/^[a-zA-Z0-9_]*$/, {
    message: 'handle must contain only letters, numbers, and underscores',
  })
  handle!: string;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'Christian Campolongo',
    minLength: 2,
    maxLength: 50,
  })
  @Transform(({ value }) => sanitizeHtml(value).trim())
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  displayName!: string;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'examplePassword22?',
    minLength: 8,
    maxLength: 32,
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).*$/, {
    message:
      'password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
  })
  password!: string;
}
