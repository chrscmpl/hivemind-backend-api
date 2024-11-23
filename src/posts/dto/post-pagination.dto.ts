import { Pagination } from 'nestjs-typeorm-paginate';
import { PostEntity } from '../entities/post.entity';
import { PostDto } from './post.dto';
import { ApiProperty } from '@nestjs/swagger';
import { getPostArrayDtoExample } from '../examples/post-array.example';

class PostPaginationMetaDto {
  @ApiProperty({ nullable: false, type: 'number', example: 1002 })
  public totalItems: number;

  @ApiProperty({ nullable: false, type: 'number', example: 10 })
  public itemCount: number;

  @ApiProperty({ nullable: false, type: 'number', example: 10 })
  public itemsPerPage: number;

  @ApiProperty({ nullable: false, type: 'number', example: 101 })
  public totalPages: number;

  @ApiProperty({ nullable: false, type: 'number', example: 25 })
  public currentPage: number;
}

export class PostPaginationDto {
  @ApiProperty({ nullable: false, type: PostPaginationMetaDto })
  public meta: PostPaginationMetaDto;

  @ApiProperty({
    nullable: false,
    type: [PostDto],
    example: getPostArrayDtoExample(),
  })
  public items: PostDto[];

  public static fromPagination(
    pagination: Pagination<PostEntity>,
  ): PostPaginationDto {
    const postPaginationDto = new PostPaginationDto();
    postPaginationDto.meta = pagination.meta as PostPaginationMetaDto;
    postPaginationDto.items = pagination.items.map((post) =>
      PostDto.fromEntity(post),
    );
    return postPaginationDto;
  }
}
