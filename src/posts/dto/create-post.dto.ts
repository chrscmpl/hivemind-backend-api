import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class CreatePostDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'My first post',
    minLength: 5,
    maxLength: 100,
  })
  @Transform(({ value }) => sanitizeHtml(value).trim())
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  public title!: string;

  @ApiProperty({
    nullable: true,
    type: 'string',
    example: 'This is my first post.',
    maxLength: 1000,
  })
  @Transform(({ value }) => sanitizeHtml(value).trim())
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  public content?: string;
}
