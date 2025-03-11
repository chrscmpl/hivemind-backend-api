import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { getCommentIncludeQueryExamples } from '../example/comment-include-query.example';
import { CommentIncludeEnum } from '../enum/comment-include.enum';
import { getCommentExcludeQueryExamples } from '../example/comment-exclude-query.example';
import { CommentExcludeEnum } from '../enum/comment-exclude.enum';

export class GetCommentQueryDto {
  @ApiProperty({
    description: 'Comma-separated list of additional parameters',
    required: false,
    type: 'string',
    examples: getCommentIncludeQueryExamples(),
  })
  @Transform(({ value }) => value.split(',').map((v: string) => v.trim()))
  @IsOptional()
  @IsArray()
  @IsEnum(CommentIncludeEnum, { each: true })
  public include: CommentIncludeEnum[] = [];

  @ApiProperty({
    description: 'Comma-separated list of fields to exclude',
    required: false,
    type: 'string',
    examples: getCommentExcludeQueryExamples(),
  })
  @Transform(({ value }) => value.split(',').map((v: string) => v.trim()))
  @IsOptional()
  @IsArray()
  @IsEnum(CommentExcludeEnum, { each: true })
  public exclude: CommentExcludeEnum[] = [];
}
