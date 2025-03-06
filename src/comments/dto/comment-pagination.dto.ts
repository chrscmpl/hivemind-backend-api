import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiProperty } from '@nestjs/swagger';
import { CommentEntity } from '../entities/comment.entity';
import { CommentDto } from './comment.dto';
import { getCommentArrayDtoExample } from '../example/comment-array.example';

class CommentPaginationMetaDto {
  @ApiProperty({ nullable: false, type: 'number', example: 92 })
  public totalItems?: number;

  @ApiProperty({ nullable: false, type: 'number', example: 10 })
  public itemCount: number;

  @ApiProperty({ nullable: false, type: 'number', example: 10 })
  public itemsPerPage: number;

  @ApiProperty({ nullable: false, type: 'number', example: 10 })
  public totalPages?: number;

  @ApiProperty({ nullable: false, type: 'number', example: 2 })
  public currentPage: number;

  @ApiProperty({
    nullable: true,
    type: 'string',
    example: '2024-11-06T22:00:00Z',
  })
  public after?: string;

  @ApiProperty({
    nullable: true,
    type: 'array',
  })
  public includes?: string;

  public constructor(meta: Pagination<CommentEntity>['meta']) {
    this.totalItems = meta.totalItems;
    this.itemCount = meta.itemCount;
    this.itemsPerPage = meta.itemsPerPage;
    this.totalPages = meta.totalPages;
    this.currentPage = meta.currentPage;
    if (meta.after) {
      this.after = meta.after;
    }
    if (meta.includes?.length) {
      this.includes = meta.includes;
    }
  }
}

export class CommentPaginationDto {
  @ApiProperty({ nullable: false, type: CommentPaginationMetaDto })
  public meta: CommentPaginationMetaDto;

  @ApiProperty({
    nullable: false,
    type: [CommentDto],
    example: getCommentArrayDtoExample(),
  })
  public items: CommentDto[];

  public constructor(pagination: Pagination<CommentEntity>) {
    this.meta = new CommentPaginationMetaDto(pagination.meta);
    this.items = pagination.items.map((post) => new CommentDto(post));
  }
}
