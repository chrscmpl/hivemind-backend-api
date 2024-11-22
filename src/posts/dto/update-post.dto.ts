import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length, MaxLength } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    nullable: true,
    type: 'string',
    example: 'My first post (updated)',
    minLength: 5,
    maxLength: 100,
  })
  @IsOptional()
  @Length(5, 100)
  public title: string;

  @ApiProperty({
    nullable: true,
    type: 'string',
    example: 'This is my first post. EDIT: I have updated this post.',
    maxLength: 1000,
  })
  @IsOptional()
  @MaxLength(1000)
  public content?: string;
}
