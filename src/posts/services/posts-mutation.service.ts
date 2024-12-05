import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsMutationService {
  public constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  public async create(
    createPostDto: CreatePostDto,
    userId: number,
  ): Promise<PostEntity> {
    const post = this.postsRepository.create({
      ...createPostDto,
      userId,
    });
    return this.postsRepository.save(post);
  }

  public async update(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Partial<PostEntity>> {
    return this.postsRepository.save({ id, ...updatePostDto });
  }

  public async delete(id: number): Promise<unknown> {
    return this.postsRepository.delete(id);
  }
}
