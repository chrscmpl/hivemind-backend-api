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

@Injectable()
export class PostsFetchService {
  private static readonly standardColumns: string[] = [
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
    options: IPaginationOptions & {
      includeVoteOf?: number | null;
      includeContent?: boolean;
      includeUser?: boolean;
      sort?: PostSortEnum;
    },
  ): Observable<Pagination<PostEntity>> {
    return from(paginate<PostEntity>(this.getQueryBuilder(options), options));
  }

  private getQueryBuilder(options: {
    includeVoteOf?: number | null;
    includeContent?: boolean;
    includeUser?: boolean;
    sort?: PostSortEnum;
  }) {
    let queryBuilder = this.createBasicQueryBuilder();

    queryBuilder = this.addSelect(queryBuilder, options);

    queryBuilder = this.addRelations(queryBuilder, options);

    queryBuilder = this.addSort(queryBuilder, options);

    return queryBuilder;
  }

  private createBasicQueryBuilder(): SelectQueryBuilder<PostEntity> {
    return this.postsRepository.createQueryBuilder('p');
  }

  private addSelect(
    queryBuilder: SelectQueryBuilder<PostEntity>,
    options?: { includeContent?: boolean },
  ): SelectQueryBuilder<PostEntity> {
    return queryBuilder.select(this.getColumns(options));
  }

  private addRelations(
    queryBuilder: SelectQueryBuilder<PostEntity>,
    options?: { includeUser?: boolean },
  ): SelectQueryBuilder<PostEntity> {
    for (const relation of this.getRelations(options)) {
      queryBuilder = queryBuilder.leftJoinAndSelect(`p.${relation}`, relation);
    }

    return queryBuilder;
  }

  private addSort(
    queryBuilder: SelectQueryBuilder<PostEntity>,
    options?: {
      sort?: PostSortEnum;
    },
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
      default:
        return queryBuilder;
    }
  }

  private getColumns(options?: { includeContent?: boolean }): string[] {
    return options?.includeContent
      ? [...PostsFetchService.standardColumns, 'p.content']
      : PostsFetchService.standardColumns;
  }

  private getRelations(options?: { includeUser?: boolean }): string[] {
    return options?.includeUser ? ['user'] : [];
  }
}
