import { Pagination } from 'nestjs-typeorm-paginate';
import { PostEntity } from '../entities/post.entity';
import { PostDto } from './post.dto';
import { ApiProperty } from '@nestjs/swagger';
import { getPostArrayDtoExample } from '../examples/post-array.example';

class PostPaginationMetaDto {
  @ApiProperty({ nullable: false, type: 'number', example: 1002 })
  public totalItems?: number;

  @ApiProperty({ nullable: false, type: 'number', example: 10 })
  public itemCount: number;

  @ApiProperty({ nullable: false, type: 'number', example: 10 })
  public itemsPerPage: number;

  @ApiProperty({ nullable: false, type: 'number', example: 101 })
  public totalPages?: number;

  @ApiProperty({ nullable: false, type: 'number', example: 25 })
  public currentPage: number;

  public constructor(meta: Pagination<PostEntity>['meta']) {
    this.totalItems = meta.totalItems;
    this.itemCount = meta.itemCount;
    this.itemsPerPage = meta.itemsPerPage;
    this.totalPages = meta.totalPages;
    this.currentPage = meta.currentPage;
  }
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

  public constructor(pagination: Pagination<PostEntity>) {
    this.meta = new PostPaginationMetaDto(pagination.meta);
    this.items = pagination.items.map((post) => new PostDto(post));
  }
}
