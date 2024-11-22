import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
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
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto, userId: number): Observable<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      user: { id: userId },
    });
    return from(this.postsRepository.save(post));
  }

  paginate(options: IPaginationOptions): Observable<Pagination<Post>> {
    return from(paginate<Post>(this.postsRepository, options));
  }

  findOne(id: number): Observable<Post> {
    return from(this.postsRepository.findOneByOrFail({ id }));
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return from(this.postsRepository.update(id, updatePostDto));
  }

  remove(id: number) {
    return from(this.postsRepository.delete(id));
  }
}
