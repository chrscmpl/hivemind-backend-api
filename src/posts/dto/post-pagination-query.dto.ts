import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
import { PostSortEnum } from '../enum/post-sort.enum';
import parseDuration from 'parse-duration';
import { PostIncludeEnum } from '../enum/post-include.enum';
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { getPostIncludeQueryExamples } from '../examples/post-include-query.example';
import { getPostExcludeQueryExamples } from '../examples/post-exclude-query.example';
import { PostExcludeEnum } from '../enum/post-exclude.enum';
import { getAgeStringExamples } from 'src/common/examples/misc/age-string.example';

export class PostPaginationQueryDto {
  @ApiProperty({
    required: false,
    type: 'string',
    example: 'Apple pie',
    maxLength: 512,
  })
  @Transform(({ value }) => value.trim() || undefined)
  @IsOptional()
  @MaxLength(512)
  public q?: string;

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
    enum: PostSortEnum,
    example: PostSortEnum.CONTROVERSIAL,
    default: PostSortEnum.CONTROVERSIAL,
  })
  @IsOptional()
  @IsEnum(PostSortEnum)
  public sort: PostSortEnum = PostSortEnum.CONTROVERSIAL;

  @ApiProperty({
    required: false,
    type: 'string',
    example: '7d',
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
    examples: getPostIncludeQueryExamples(),
  })
  @Transform(({ value }) => value.split(',').map((v: string) => v.trim()))
  @IsOptional()
  @IsArray()
  @IsEnum(PostIncludeEnum, { each: true })
  public include: PostIncludeEnum[] = [];

  @ApiProperty({
    description: 'Comma-separated list of fields to exclude',
    required: false,
    type: 'string',
    example: 'content',
    examples: getPostExcludeQueryExamples(),
  })
  @Transform(({ value }) => value.split(',').map((v: string) => v.trim()))
  @IsOptional()
  @IsArray()
  @IsEnum(PostExcludeEnum, { each: true })
  public exclude: PostExcludeEnum[] = [];
}
