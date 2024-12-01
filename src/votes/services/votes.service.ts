import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VoteEntity } from '../entities/vote.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { VoteEnum } from '../enum/vote.enum';

@Injectable()
export class VotesService {
  public constructor(
    @InjectRepository(VoteEntity)
    private readonly votesRepository: Repository<VoteEntity>,
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
          where: { user: { id: userId }, post: { id: postId } },
        });

        if (vote && vote.value === voteBool) {
          return vote;
        }

        if (vote) {
          vote.value = voteBool;
        } else {
          vote = this.votesRepository.create({
            value: voteBool,
            user: { id: userId },
            post: { id: postId },
          });
        }

        return this.votesRepository.save(vote);
      })(),
    );
  }

  public delete(userId: number, postId: number): Observable<unknown> {
    return from(
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
