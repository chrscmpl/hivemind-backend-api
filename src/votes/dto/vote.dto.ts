import { ApiProperty } from '@nestjs/swagger';
import { PostVoteEnum } from '../enum/vote.enum';

export class PostVoteDto {
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
    enum: PostVoteEnum,
  })
  public vote!: PostVoteEnum;

  public constructor(userId: number, postId: number, vote: PostVoteEnum) {
    this.userId = userId;
    this.postId = postId;
    this.vote = vote;
  }
}
