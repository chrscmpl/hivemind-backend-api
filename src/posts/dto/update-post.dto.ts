import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';

@ValidatorConstraint()
class AtLeastOnePostFieldConstraint implements ValidatorConstraintInterface {
  public validate(_: unknown, args: ValidationArguments): boolean {
    const object = args.object as UpdatePostDto;
    return !!(object.title || object.content);
  }

  public defaultMessage(): string {
    return 'At least one of the fields (title, content) must be provided.';
  }
}

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    nullable: true,
    type: 'string',
    example: 'My first post (updated)',
    minLength: 5,
    maxLength: 100,
  })
  @Transform(({ value }) => sanitizeHtml(value).trim())
  @IsOptional()
  @IsString()
  @Length(5, 100)
  public title!: string;

  @ApiProperty({
    nullable: true,
    type: 'string',
    example: 'This is my first post. EDIT: I have updated this post.',
    maxLength: 1000,
  })
  @Transform(({ value }) => sanitizeHtml(value).trim())
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  public content?: string;

  @Validate(AtLeastOnePostFieldConstraint)
  private _: unknown;
}
