import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VoteEntity } from '../entities/vote.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostVoteEnum } from '../enum/vote.enum';

@Injectable()
export class VotesService {
  public constructor(
    @InjectRepository(VoteEntity)
    private readonly votesRepository: Repository<VoteEntity>,
  ) {}

  public async set(
    userId: number,
    postId: number,
    value: PostVoteEnum.UP | PostVoteEnum.DOWN,
  ): Promise<VoteEntity> {
    const voteBool: boolean = value === PostVoteEnum.UP;

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
  }

  public async delete(userId: number, postId: number): Promise<unknown> {
    // Votes need to be loaded before being updated or removed
    // so that the subscriber can be triggered
    return this.votesRepository
      .findOneOrFail({
        where: { userId, postId },
      })
      .then((vote) => {
        this.votesRepository.remove(vote);
      });
  }
}
