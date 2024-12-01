import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';

@Injectable()
export class PostsMutationService {
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

  public update(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Observable<Partial<PostEntity>> {
    return from(this.postsRepository.save({ id, ...updatePostDto }));
  }

  public delete(id: number): Observable<unknown> {
    return from(this.postsRepository.delete(id));
  }
}
