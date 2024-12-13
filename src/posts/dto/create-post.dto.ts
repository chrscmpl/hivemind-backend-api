import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Sanitize } from 'src/common/decorators/sanitize.decorator';

export class CreatePostDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'My first post',
    minLength: 5,
    maxLength: 100,
  })
  @Sanitize()
  @Transform(({ value }) => value.trim())
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
  @Sanitize()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  public content?: string;
}
