import { defaults } from 'lodash';
import { PostEntity } from '../entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';

class UserPreviewDto {
  @ApiProperty({ nullable: false, type: 'number', example: 1 })
  public id: number;

  @ApiProperty({ nullable: true, type: 'string', example: 'chrscmpl' })
  public username?: string;

  public constructor(user: PostEntity['user']) {
    this.id = user.id;
    if (user.username) {
      this.username = user.username;
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
    this.createdAt = `${post.createdAt.toISOString().split('.')[0]}Z`;
    this.updatedAt = `${post.updatedAt.toISOString().split('.')[0]}Z`;
    this.user = new UserPreviewDto(defaults({ id: post.userId }, post.user));
  }
}
