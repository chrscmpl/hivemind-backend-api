import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { PostSortEnum } from '../enum/post-sort.enum';

interface PostsQueryOptions {
  includeVoteOf?: number | null;
  includeContent?: boolean | null;
  includeUser?: boolean | null;
  sort?: PostSortEnum | null;
  after?: Date | null;
}

@Injectable()
export class PostsFetchService {
  private static readonly standardColumns: `p.${keyof PostEntity}`[] = [
    'p.id',
    'p.title',
    'p.upvoteCount',
    'p.downvoteCount',
    'p.createdAt',
    'p.updatedAt',
    'p.userId',
  ];

  public constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  public findOne(
    id: number,
    options?: { includeUser?: boolean; includeVoteOf?: number | null },
  ): Observable<PostEntity> {
    return from(
      this.postsRepository.findOneOrFail({
        where: { id },
        relations: options?.includeUser ? ['user'] : [],
      }),
    );
  }

  public paginate(
    options: IPaginationOptions & PostsQueryOptions,
  ): Observable<Pagination<PostEntity>> {
    return from(
      paginate<PostEntity>(this.getQueryBuilder(options), options),
    ).pipe(
      map((pagination) =>
        options.includeVoteOf ? this.fillOwnVote(pagination) : pagination,
      ),
    );
  }

  private fillOwnVote(
    pagination: Pagination<PostEntity>,
  ): Pagination<PostEntity> {
    pagination.items.forEach((post) => {
      if (post.votes.length === 1) {
        post.ownVote = post.votes[0].value;
      }
    });
    return pagination;
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
    options?: Pick<PostsQueryOptions, 'includeContent'>,
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
      queryBuilder = queryBuilder.leftJoinAndSelect('p.user', 'user');
    }

    if (options?.includeVoteOf) {
      queryBuilder = queryBuilder.leftJoinAndSelect(
        'p.votes',
        'votes',
        'votes.userId = :userId',
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
        return queryBuilder.orderBy('p.upvoteCount', 'DESC');
      case PostSortEnum.UNPOPULAR:
        return queryBuilder.orderBy('p.downvoteCount', 'DESC');
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
    options?: Pick<PostsQueryOptions, 'includeContent'>,
  ): `p.${keyof PostEntity}`[] {
    return options?.includeContent
      ? [...PostsFetchService.standardColumns, 'p.content']
      : PostsFetchService.standardColumns;
  }
}
