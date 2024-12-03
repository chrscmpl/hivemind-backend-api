import { IsEnum } from 'class-validator';
import { PostVoteEnum } from '../enum/vote.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SetPostVoteDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'up',
    enum: PostVoteEnum,
  })
  @IsEnum(PostVoteEnum)
  public vote!: PostVoteEnum;
}
