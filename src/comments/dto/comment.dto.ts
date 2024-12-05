import { defaults } from 'lodash';
import { ApiProperty } from '@nestjs/swagger';
import { noMsIso } from 'src/common/helpers/no-ms-iso.helper';
import { CommentEntity } from '../entities/comment.entity';
import { PostDto } from 'src/posts/dto/post.dto';

// different from UserDto mainly because of the nullable properties
class UserPreviewDto {
  @ApiProperty({ nullable: true, type: 'number', example: 1 })
  public id: number;

  @ApiProperty({ nullable: true, type: 'string', example: 'chrscmpl' })
  public handle?: string;

  @ApiProperty({
    nullable: true,
    type: 'string',
    example: 'Christian Campolongo',
  })
  public displayName?: string;

  public constructor(user: CommentEntity['user']) {
    this.id = user.id;
    if (user.handle) {
      this.handle = user.handle;
    }
    if (user.displayName) {
      this.displayName = user.displayName;
    }
  }
}

export class CommentDto {
  @ApiProperty({ nullable: false, type: 'number', example: 1 })
  public id: number;

  @ApiProperty({
    nullable: true,
    type: 'string',
    example: 'I agree with your post.',
  })
  public content?: string;

  @ApiProperty({
    nullable: true,
    type: 'string',
    example: '2024-12-12T12:00:00Z',
  })
  public createdAt?: string;

  @ApiProperty({
    nullable: true,
    type: 'string',
    example: '2024-12-13T18:30:00Z',
  })
  public updatedAt?: string;

  @ApiProperty({ nullable: false, type: UserPreviewDto, example: { id: 1 } })
  public user!: UserPreviewDto;

  @ApiProperty({ nullable: false, type: PostDto, example: { id: 1 } })
  public post!: PostDto;

  public constructor(comment: Partial<CommentEntity>) {
    this.id = comment.id as number;
    if (comment.content) {
      this.content = comment.content;
    }
    if (comment.createdAt) {
      this.createdAt = noMsIso(comment.createdAt);
    }
    if (comment.updatedAt) {
      this.updatedAt = noMsIso(comment.updatedAt);
    }
    this.user = new UserPreviewDto(
      defaults({ id: comment.userId }, comment.user),
    );
    this.post = new PostDto(defaults({ id: comment.postId }, comment.post));
  }
}
