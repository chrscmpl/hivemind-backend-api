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
import { Sanitize } from 'src/common/decorators/sanitize.decorator';

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
    maxLength: 300,
  })
  @Sanitize()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  @Length(5, 300)
  public title!: string;

  @ApiProperty({
    nullable: true,
    type: 'string',
    example: 'This is my first post. EDIT: I have updated this post.',
    maxLength: 3000,
  })
  @Sanitize()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  public content?: string;

  @Validate(AtLeastOnePostFieldConstraint)
  private _: unknown;
}
