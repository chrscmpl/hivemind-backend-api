import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Sanitize } from 'src/common/decorators/sanitize.decorator';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends CreateCommentDto {
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
  public content!: string;
}
