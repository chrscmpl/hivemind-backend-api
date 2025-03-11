import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PostIncludeEnum } from '../enum/post-include.enum';
import { getPostIncludeQueryExamples } from '../examples/post-include-query.example';
import { getPostExcludeQueryExamples } from '../examples/post-exclude-query.example';
import { PostExcludeEnum } from '../enum/post-exclude.enum';

export class GetPostQueryDto {
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
    examples: getPostExcludeQueryExamples(),
  })
  @Transform(({ value }) => value.split(',').map((v: string) => v.trim()))
  @IsOptional()
  @IsArray()
  @IsEnum(PostExcludeEnum, { each: true })
  public exclude: PostExcludeEnum[] = [];
}
