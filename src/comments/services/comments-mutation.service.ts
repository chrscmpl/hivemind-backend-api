import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

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

  public async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Partial<CommentEntity>> {
    return this.commentsRepository.save({ id, ...updateCommentDto });
  }

  public async delete(id: number): Promise<CommentEntity> {
    const comment = await this.commentsRepository.findOneOrFail({
      where: { id },
    });

    return await this.commentsRepository.remove(comment).then(() => comment);
  }

  public async deleteEntity(comment: CommentEntity): Promise<CommentEntity> {
    return await this.commentsRepository.remove(comment).then(() => comment);
  }
}
