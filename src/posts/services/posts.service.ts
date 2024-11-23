import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class PostsService {
  public constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  public create(
    createPostDto: CreatePostDto,
    userId: number,
  ): Observable<PostEntity> {
    const post = this.postsRepository.create({
      ...createPostDto,
      user: { id: userId },
    });
    return from(this.postsRepository.save(post));
  }

  public paginate(
    options: IPaginationOptions & {
      includeVoteOf?: number;
      includeContent?: boolean;
    },
  ): Observable<Pagination<PostEntity>> {
    const columns: (keyof PostEntity)[] = [
      'id',
      'title',
      'createdAt',
      'updatedAt',
      'userId',
    ];
    if (options.includeContent) columns.push('content');

    return from(
      paginate<PostEntity>(this.postsRepository, options, {
        select: columns,
      }),
    );
  }

  public findOne(
    id: number,
    options: { relations: string[]; includeVoteOf: number | null } = {
      relations: [],
      includeVoteOf: null,
    },
  ): Observable<PostEntity> {
    return from(
      this.postsRepository.findOneOrFail({
        where: { id },
        relations: options.relations,
      }),
    );
  }

  public update(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Observable<PostEntity> {
    return from(this.postsRepository.save({ id, ...updatePostDto }));
  }

  public remove(id: number): Observable<unknown> {
    return from(this.postsRepository.delete(id));
  }
}
