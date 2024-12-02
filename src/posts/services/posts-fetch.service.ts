import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { PostSortEnum } from '../enum/post-sort.enum';

interface PostsQueryOptions {
  includeVoteOf?: number | null;
  includeContent?: boolean;
  includeUser?: boolean;
  sort?: PostSortEnum;
  after?: Date;
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
    options?: { relations?: string[]; includeVoteOf?: number | null },
  ): Observable<PostEntity> {
    return from(
      this.postsRepository.findOneOrFail({
        where: { id },
        relations: options?.relations ?? [],
      }),
    );
  }

  public paginate(
    options: IPaginationOptions & PostsQueryOptions,
  ): Observable<Pagination<PostEntity>> {
    return from(paginate<PostEntity>(this.getQueryBuilder(options), options));
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
    options?: Pick<PostsQueryOptions, 'includeUser'>,
  ): SelectQueryBuilder<PostEntity> {
    for (const relation of this.getRelations(options)) {
      queryBuilder = queryBuilder.leftJoinAndSelect(`p.${relation}`, relation);
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
        return queryBuilder.orderBy('upvoteCount', 'DESC');
      case PostSortEnum.UNPOPULAR:
        return queryBuilder.orderBy('downvoteCount', 'DESC');
      case PostSortEnum.CONTROVERSIAL:
        return queryBuilder
          .addSelect(
            '(upvoteCount + downvoteCount) - ABS(upvoteCount - downvoteCount)',
            'controversialScore',
          )
          .orderBy('controversialScore', 'DESC');
      case PostSortEnum.NEW:
        return queryBuilder.orderBy('createdAt', 'DESC');
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

  private getRelations(
    options?: Pick<PostsQueryOptions, 'includeUser'>,
  ): string[] {
    return options?.includeUser ? ['user'] : [];
  }
}
