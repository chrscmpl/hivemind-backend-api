import { ApiProperty } from '@nestjs/swagger';
import { VoteEnum } from '../enum/vote.enum';

export class VoteDto {
  @ApiProperty({
    nullable: false,
    type: 'number',
    example: 1,
  })
  public userId: number;

  @ApiProperty({
    nullable: false,
    type: 'number',
    example: 1,
  })
  public postId: number;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'up',
    enum: VoteEnum,
  })
  public vote!: VoteEnum;

  public constructor(userId: number, postId: number, vote: VoteEnum) {
    this.userId = userId;
    this.postId = postId;
    this.vote = vote;
  }
}
