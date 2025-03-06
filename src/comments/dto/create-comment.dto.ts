import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Sanitize } from 'src/common/decorators/sanitize.decorator';

export class CreateCommentDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'I agree with your post.',
    maxLength: 1000,
  })
  @Sanitize()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  public content?: string;
}
