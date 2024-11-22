import { Pagination } from 'nestjs-typeorm-paginate';
import { PostEntity } from '../entities/post.entity';
import { PostDto } from './post.dto';
import { ApiProperty } from '@nestjs/swagger';

class PostPaginationMetaDto {
  @ApiProperty({ nullable: false, type: 'number', example: 995 })
  public totalItems: number;

  @ApiProperty({ nullable: false, type: 'number', example: 5 })
  public itemCount: number;

  @ApiProperty({ nullable: false, type: 'number', example: 10 })
  public itemsPerPage: number;

  @ApiProperty({ nullable: false, type: 'number', example: 100 })
  public totalPages: number;

  @ApiProperty({ nullable: false, type: 'number', example: 100 })
  public currentPage: number;
}

export class PostPaginationDto {
  @ApiProperty({
    nullable: false,
    type: [PostDto],
    example: [
      { id: 1, title: 'Post 1', content: 'This is the first post', user: { id: 1 } }, //prettier-ignore
      { id: 995, title: 'Post 2', content: 'This is the last post', user: { id: 9 } }, //prettier-ignore
      { id: 10, title: 'Post 3', content: 'This is the tenth post', user: { id: 2 } }, //prettier-ignore
      { id: 994, title: 'Post 4', content: 'This is the second to last post', user:{ id: 10 } }, //prettier-ignore
      { id: 5, title: 'Post 5', content: 'This is the fifth post', user: { id: 2 } }, //prettier-ignore
    ],
  })
  public items: PostDto[];

  @ApiProperty({ nullable: false, type: PostPaginationMetaDto })
  public meta: PostPaginationMetaDto;

  public static fromPagination(
    pagination: Pagination<PostEntity>,
  ): PostPaginationDto {
    const postPaginationDto = new PostPaginationDto();
    postPaginationDto.items = pagination.items.map((post) =>
      PostDto.fromEntity(post),
    );
    postPaginationDto.meta = pagination.meta as PostPaginationMetaDto;
    return postPaginationDto;
  }
}
