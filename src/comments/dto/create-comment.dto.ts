import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class CreateCommentDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'I agree with your post.',
    maxLength: 500,
  })
  @Transform(({ value }) => sanitizeHtml(value).trim())
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  public content?: string;
}
