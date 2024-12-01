import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VoteEntity } from '../entities/vote.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { VoteEnum } from '../enum/vote.enum';
import { PostEntity } from 'src/posts/entities/post.entity';

@Injectable()
export class VotesService {
  public constructor(
    @InjectRepository(VoteEntity)
    private readonly votesRepository: Repository<VoteEntity>,

    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  public set(
    userId: number,
    postId: number,
    value: VoteEnum.UP | VoteEnum.DOWN,
  ): Observable<VoteEntity> {
    return from(
      (async () => {
        const voteBool: boolean = value === VoteEnum.UP;

        let vote: VoteEntity | null = await this.votesRepository.findOne({
          where: { userId, postId },
        });

        // The vote is already set to the input value
        if (vote && vote.value === voteBool) {
          return vote;
        }

        // The vote is set to the opposite of the input value
        if (vote) {
          vote.value = voteBool;
        }
        // The user had not voted before
        else {
          vote = this.votesRepository.create({
            value: voteBool,
            userId,
            postId,
          });
        }

        return this.votesRepository.save(vote);
      })(),
    );
  }

  public delete(userId: number, postId: number): Observable<unknown> {
    return from(
      // Votes need to be loaded before being updated or removed
      // so that the subscriber can be triggered
      this.votesRepository
        .findOneOrFail({
          where: { userId, postId },
        })
        .then((vote) => {
          this.votesRepository.remove(vote);
        }),
    );
  }

  public get(postId: number) {
    return from(
      this.postsRepository.findOneOrFail({
        where: { id: postId },
        select: ['id', 'upvoteCount', 'downvoteCount'],
      }),
    );
  }
}
