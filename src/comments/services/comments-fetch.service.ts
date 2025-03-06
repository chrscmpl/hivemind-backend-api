import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

interface CommentsQueryOptions {
  postId: number;
  includeUser?: boolean;
  exclude?: (keyof CommentEntity)[] | null;
  after?: Date | null;
}

@Injectable()
export class CommentsFetchService {
  public static readonly FETCH_COLUMNS: (keyof CommentEntity)[] = [
    'id',
    'content',
    'userId',
    'postId',
    'createdAt',
    'updatedAt',
  ];

  public constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
  ) {}

  public async findOne(id: number): Promise<CommentEntity> {
    return this.commentsRepository.findOneByOrFail({ id });
  }

  public async paginate(options: IPaginationOptions & CommentsQueryOptions) {
    return paginate<CommentEntity>(this.getQueryBuilder(options), options);
  }

  private getQueryBuilder(options: CommentsQueryOptions) {
    let queryBuilder = this.createBasicQueryBuilder();

    queryBuilder = this.addSelect(queryBuilder, options);

    queryBuilder = this.addWhere(queryBuilder, options);

    queryBuilder = this.addRelations(queryBuilder, options);

    queryBuilder = this.addSort(queryBuilder);

    return queryBuilder;
  }

  private createBasicQueryBuilder(): SelectQueryBuilder<CommentEntity> {
    return this.commentsRepository.createQueryBuilder('c');
  }

  private addSelect(
    queryBuilder: SelectQueryBuilder<CommentEntity>,
    options?: Pick<CommentsQueryOptions, 'exclude'>,
  ): SelectQueryBuilder<CommentEntity> {
    return queryBuilder.select(this.getColumns(options));
  }

  private addWhere(
    queryBuilder: SelectQueryBuilder<CommentEntity>,
    options: Pick<CommentsQueryOptions, 'postId' | 'after'>,
  ): SelectQueryBuilder<CommentEntity> {
    queryBuilder = queryBuilder.andWhere('c.postId = :postId', {
      postId: options.postId,
    });

    if (options.after) {
      queryBuilder = queryBuilder.andWhere('c.createdAt > :after', {
        after: options.after,
      });
    }

    return queryBuilder;
  }

  private addRelations(
    queryBuilder: SelectQueryBuilder<CommentEntity>,
    options?: Pick<CommentsQueryOptions, 'includeUser'>,
  ): SelectQueryBuilder<CommentEntity> {
    if (options?.includeUser) {
      queryBuilder = queryBuilder.leftJoinAndSelect('c.user', 'u');
    }

    return queryBuilder;
  }

  private addSort(
    queryBuilder: SelectQueryBuilder<CommentEntity>,
  ): SelectQueryBuilder<CommentEntity> {
    return queryBuilder.orderBy('c.createdAt', 'DESC');
  }

  private getColumns(
    options?: Pick<CommentsQueryOptions, 'exclude'>,
  ): `c.${keyof CommentEntity}`[] {
    let columns = CommentsFetchService.FETCH_COLUMNS;
    if (options?.exclude?.length) {
      const excludeSet = new Set(options.exclude);
      columns = columns.filter((column) => !excludeSet.has(column));
    }
    return columns.map((column) => `c.${column}` as `c.${keyof CommentEntity}`);
  }
}
