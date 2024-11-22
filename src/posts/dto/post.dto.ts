import { defaults, isNil, omitBy } from 'lodash';
import { PostEntity } from '../entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';

class UserPreviewDto {
  @ApiProperty({ nullable: false, type: 'number', example: 1 })
  public id: number;

  @ApiProperty({ nullable: true, type: 'string', example: 'chrscmpl' })
  public username?: string;

  public static fromUser(user: PostEntity['user']): UserPreviewDto {
    const userPreviewDto = new UserPreviewDto();
    userPreviewDto.id = user.id;
    userPreviewDto.username = user.username;
    return omitBy(userPreviewDto, isNil) as UserPreviewDto;
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

  @ApiProperty({ nullable: false, type: UserPreviewDto })
  public user: UserPreviewDto;

  public static fromEntity(post: PostEntity): PostDto {
    const postDto = new PostDto();
    post = omitBy(post, isNil) as PostEntity;
    postDto.id = post.id;
    postDto.title = post.title;
    postDto.content = post.content;
    postDto.user = UserPreviewDto.fromUser(
      defaults({ id: post.userId }, post.user),
    );
    return postDto;
  }
}
