import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostVoteEntity } from '../entities/post-vote.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { PostVoteEnum } from '../enum/post-vote.enum';

@Injectable()
export class PostVotesService {
  public constructor(
    @InjectRepository(PostVoteEntity)
    private readonly votesRepository: Repository<PostVoteEntity>,
  ) {}

  public set(
    userId: number,
    postId: number,
    value: PostVoteEnum.UP | PostVoteEnum.DOWN,
  ): Observable<PostVoteEntity> {
    return from(
      (async () => {
        const voteBool: boolean = value === PostVoteEnum.UP;

        let vote: PostVoteEntity | null = await this.votesRepository.findOne({
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
}
