import { ApiProperty } from '@nestjs/swagger';
import { PostEntity } from 'src/posts/entities/post.entity';

export class PostVotesDto {
  @ApiProperty({
    nullable: false,
    type: 'number',
    example: 1,
  })
  public postId: number;

  @ApiProperty({
    nullable: false,
    type: 'number',
    example: 10,
  })
  public upvoteCount: number;

  @ApiProperty({
    nullable: false,
    type: 'number',
    example: 2,
  })
  public downvoteCount: number;

  public constructor(post: PostEntity) {
    this.postId = post.id;
    this.upvoteCount = post.upvoteCount;
    this.downvoteCount = post.downvoteCount;
  }
}
