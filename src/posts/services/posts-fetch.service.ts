import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { PostSortEnum } from '../enum/post-sort.enum';

interface PostsQueryOptions {
  includeVoteOf?: number | null;
  includeUser?: boolean | null;
  exclude?: (keyof PostEntity)[] | null;
  sort?: PostSortEnum | null;
  after?: Date | null;
}

@Injectable()
export class PostsFetchService {
  public static readonly FETCH_COLUMNS: (keyof PostEntity)[] = [
    'id',
    'title',
    'content',
    'commentCount',
    'upvoteCount',
    'downvoteCount',
    'createdAt',
    'updatedAt',
    'userId',
  ];

  public constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  public async findOne(
    id: number,
    options?: Pick<
      PostsQueryOptions,
      'includeUser' | 'includeVoteOf' | 'exclude'
    >,
  ): Promise<PostEntity> {
    const queryBuilder = this.createBasicQueryBuilder();

    queryBuilder.where('p.id = :id', { id });

    if (options?.includeUser) {
      queryBuilder.leftJoinAndSelect('p.user', 'u');
    }

    if (options?.exclude?.length) {
      queryBuilder.select(this.getColumns(options));
    }

    if (
      options?.includeVoteOf !== undefined &&
      options.includeVoteOf !== null
    ) {
      queryBuilder.leftJoinAndSelect('p.votes', 'v', 'v.userId = :userId', {
        userId: options.includeVoteOf,
      });
    }

    return queryBuilder.getOneOrFail().then((post) => {
      if (options?.includeVoteOf) {
        this.fillMyVote(post);
      }
      return post;
    });
  }

  public async paginate(
    options: IPaginationOptions & PostsQueryOptions,
  ): Promise<Pagination<PostEntity>> {
    return paginate<PostEntity>(this.getQueryBuilder(options), options) //
      .then((pagination) => {
        if (options.includeVoteOf) {
          pagination.items.forEach((post) => {
            this.fillMyVote(post);
          });
        }
        return pagination;
      });
  }

  private fillMyVote(post: PostEntity): void {
    if (post.votes.length === 1) {
      post.myVote = post.votes[0].value;
    }
  }

  private getQueryBuilder(
    options: PostsQueryOptions,
  ): SelectQueryBuilder<PostEntity> {
    let queryBuilder = this.createBasicQueryBuilder();

    queryBuilder = this.addSelect(queryBuilder, options);

    queryBuilder = this.addWhere(queryBuilder, options);

    queryBuilder = this.addRelations(queryBuilder, options);

    queryBuilder = this.addSort(queryBuilder, options);

    return queryBuilder;
  }

  private createBasicQueryBuilder(): SelectQueryBuilder<PostEntity> {
    return this.postsRepository.createQueryBuilder('p');
  }

  private addSelect(
    queryBuilder: SelectQueryBuilder<PostEntity>,
    options?: Pick<PostsQueryOptions, 'exclude'>,
  ): SelectQueryBuilder<PostEntity> {
    return queryBuilder.select(this.getColumns(options));
  }

  private addWhere(
    queryBuilder: SelectQueryBuilder<PostEntity>,
    options?: Pick<PostsQueryOptions, 'after'>,
  ): SelectQueryBuilder<PostEntity> {
    if (!options?.after) {
      return queryBuilder;
    }

    return queryBuilder.where('p.createdAt > :after', {
      after: options.after,
    });
  }

  private addRelations(
    queryBuilder: SelectQueryBuilder<PostEntity>,
    options?: Pick<PostsQueryOptions, 'includeUser' | 'includeVoteOf'>,
  ): SelectQueryBuilder<PostEntity> {
    if (options?.includeUser) {
      queryBuilder = queryBuilder.leftJoinAndSelect('p.user', 'u');
    }

    if (options?.includeVoteOf) {
      queryBuilder = queryBuilder.leftJoinAndSelect(
        'p.votes',
        'v',
        'v.userId = :userId',
        { userId: options.includeVoteOf },
      );
    }

    return queryBuilder;
  }

  private addSort(
    queryBuilder: SelectQueryBuilder<PostEntity>,
    options?: Pick<PostsQueryOptions, 'sort'>,
  ): SelectQueryBuilder<PostEntity> {
    if (!options?.sort) {
      return queryBuilder;
    }

    switch (options.sort) {
      case PostSortEnum.POPULAR:
        return queryBuilder
          .addSelect('p.upvoteCount - p.downvoteCount', 'popularScore')
          .orderBy('popularScore', 'DESC');
      case PostSortEnum.UNPOPULAR:
        return queryBuilder
          .addSelect('p.downvoteCount - p.upvoteCount', 'unpopularScore')
          .orderBy('unpopularScore', 'DESC');
      case PostSortEnum.CONTROVERSIAL:
        return queryBuilder
          .addSelect(
            '(p.upvoteCount + p.downvoteCount) - (ABS(p.upvoteCount - p.downvoteCount) * 0.8)',
            'controversialScore',
          )
          .orderBy('controversialScore', 'DESC');
      case PostSortEnum.NEW:
        return queryBuilder.orderBy('p.createdAt', 'DESC');
      default:
        return queryBuilder;
    }
  }

  private getColumns(
    options?: Pick<PostsQueryOptions, 'exclude'>,
  ): `p.${keyof PostEntity}`[] {
    let columns = PostsFetchService.FETCH_COLUMNS;
    if (options?.exclude?.length) {
      const excludeSet = new Set(options.exclude);
      columns = columns.filter((column) => !excludeSet.has(column));
    }
    return columns.map((column) => `p.${column}` as `p.${keyof PostEntity}`);
  }
}
