import { defaults } from 'lodash';
import { PostEntity } from '../entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';
import { noMsIso } from 'src/common/helpers/no-ms-iso.helper';

// different from UserDto mainly because of the nullable properties
class UserPreviewDto {
  @ApiProperty({ nullable: false, type: 'number', example: 1 })
  public id: number;

  @ApiProperty({ nullable: true, type: 'string', example: 'chrscmpl' })
  public handle?: string;

  @ApiProperty({
    nullable: true,
    type: 'string',
    example: 'Christian Campolongo',
  })
  public displayName?: string;

  public constructor(user: PostEntity['user']) {
    this.id = user.id;
    if (user.handle) {
      this.handle = user.handle;
    }
    if (user.displayName) {
      this.displayName = user.displayName;
    }
  }
}

export class PostDto {
  @ApiProperty({ nullable: false, type: 'number', example: 1 })
  public id: number;

  @ApiProperty({ nullable: false, type: 'string', example: 'My first post' })
  public title: string;

  @ApiProperty({
    nullable: true,
    type: 'string',
    example: 'This is my first post.',
  })
  public content?: string;

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

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: '2024-12-12T12:00:00Z',
  })
  public createdAt: string;

  @ApiProperty({
    nullable: false,
    type: 'string',
    example: '2024-12-13T18:30:00Z',
  })
  public updatedAt: string;

  @ApiProperty({ nullable: false, type: UserPreviewDto })
  public user: UserPreviewDto;

  public constructor(post: PostEntity) {
    this.id = post.id;
    this.title = post.title;
    if (post.content) {
      this.content = post.content;
    }
    this.upvoteCount = post.upvoteCount;
    this.downvoteCount = post.downvoteCount;
    this.createdAt = noMsIso(post.createdAt);
    this.updatedAt = noMsIso(post.updatedAt);
    this.user = new UserPreviewDto(defaults({ id: post.userId }, post.user));
  }
}
