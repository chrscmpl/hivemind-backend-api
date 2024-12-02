import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GetPostIncludeValueEnum } from '../enum/get-post-include-value.enum';
import { getGetPostIncludeQueryExamples } from '../examples/get-post-include-query.example';

export class GetPostQueryDto {
  @ApiProperty({
    description: 'Comma-separated list of additional parameters',
    required: false,
    type: 'string',
    examples: getGetPostIncludeQueryExamples(),
  })
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  @IsEnum(GetPostIncludeValueEnum, { each: true })
  public include: GetPostIncludeValueEnum[] = [];
}
