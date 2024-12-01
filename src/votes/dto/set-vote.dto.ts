import { IsEnum } from 'class-validator';
import { VoteEnum } from '../enum/vote.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SetVoteDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'up',
    enum: VoteEnum,
  })
  @IsEnum(VoteEnum)
  public vote!: VoteEnum;
}
