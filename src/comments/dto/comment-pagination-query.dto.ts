import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import parseDuration from 'parse-duration';
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { getAgeStringExamples } from 'src/common/examples/misc/age-string.example';
import { getCommentIncludeQueryExamples } from '../example/comment-include-query.example';
import { CommentIncludeEnum } from '../enum/comment-include.enum';
import { getCommentExcludeQueryExamples } from '../example/comment-exclude-query.example';
import { CommentExcludeEnum } from '../enum/comment-exclude.enum';

export class CommentsPaginationQueryDto {
  @ApiProperty({
    required: false,
    type: 'number',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  public page: number = 1;

  @ApiProperty({
    required: false,
    type: 'number',
    example: 10,
    default: 10,
    maximum: 100,
  })
  @Transform(({ value }) => Math.min(parseInt(value), 100))
  @IsOptional()
  @IsInt()
  @Min(1)
  public limit: number = 10;

  @ApiProperty({
    required: false,
    type: 'string',
    examples: getAgeStringExamples(),
  })
  @Transform(({ value }) => {
    if (value === 'all') {
      return null;
    }
    const parsed = parseDuration(value);
    if (parsed === null) {
      throw new BadRequestException(['age must be a valid duration string.']);
    }
    return parsed;
  })
  @IsOptional()
  public age: number | null = null;

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
    example: 'content',
    examples: getCommentExcludeQueryExamples(),
  })
  @Transform(({ value }) => value.split(',').map((v: string) => v.trim()))
  @IsOptional()
  @IsArray()
  @IsEnum(CommentExcludeEnum, { each: true })
  public exclude: CommentExcludeEnum[] = [];
}
