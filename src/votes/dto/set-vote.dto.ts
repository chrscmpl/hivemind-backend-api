import { IsEnum } from 'class-validator';
import { PostVoteEnum } from '../enum/vote.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SetPostVoteDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'up',
    enum: PostVoteEnum,
  })
  @Transform(({ value }) => (value === null ? PostVoteEnum.NONE : value))
  @IsEnum(PostVoteEnum, {
    message: `vote must be one of the following values: ${Object.values(PostVoteEnum).join(', ')}, null`,
  })
  public vote!: PostVoteEnum;
}
