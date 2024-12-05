import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class CommentsMutationService {
  public constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
  ) {}

  public async create(
    createCommentDto: CreateCommentDto,
    postId: number,
    userId: number,
  ): Promise<CommentEntity> {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      postId,
      userId,
    });
    return this.commentsRepository.save(comment);
  }
}
