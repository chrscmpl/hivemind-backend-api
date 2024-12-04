import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PostIncludeValueEnum } from '../enum/post-include-value.enum';
import { getPostIncludeQueryExamples } from '../examples/post-include-query.example';
import { PostEntity } from '../entities/post.entity';
import { getPostExcludeQueryExamples } from '../examples/post-exclude-query.example';

export class GetPostQueryDto {
  @ApiProperty({
    description: 'Comma-separated list of additional parameters',
    required: false,
    type: 'string',
    examples: getPostIncludeQueryExamples(),
  })
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  @IsEnum(PostIncludeValueEnum, { each: true })
  public include: PostIncludeValueEnum[] = [];

  @ApiProperty({
    description: 'Comma-separated list of fields to exclude',
    required: false,
    type: 'string',
    examples: getPostExcludeQueryExamples(),
  })
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  @IsIn(PostEntity.FETCH_COLUMNS, { each: true })
  public exclude: (keyof PostEntity)[] = [];
}
