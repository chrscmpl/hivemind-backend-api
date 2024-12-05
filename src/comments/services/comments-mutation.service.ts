import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { from, Observable } from 'rxjs';

@Injectable()
export class CommentsMutationService {
  public constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
  ) {}

  public create(
    createCommentDto: CreateCommentDto,
    postId: number,
    userId: number,
  ): Observable<CommentEntity> {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      postId,
      userId,
    });
    return from(this.commentsRepository.save(comment));
  }
}
