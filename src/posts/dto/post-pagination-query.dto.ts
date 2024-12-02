import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PostSortEnum } from '../enum/post-sort.enum';
import parse from 'parse-duration';
import { PaginationIncludeValueEnum } from '../enum/pagination-include-value.enum';
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { getPostsPaginationIncludeQueryExamples } from '../examples/posts-pagination-include-query.example';

export class PostPaginationQueryDto {
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

  @ApiProperty({ required: false, type: 'string', example: '7d' })
  @Transform(({ value }) => {
    const parsed = parse(value);
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
    examples: getPostsPaginationIncludeQueryExamples(),
  })
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  @IsEnum(PaginationIncludeValueEnum, { each: true })
  public include: PaginationIncludeValueEnum[] = [];
}
