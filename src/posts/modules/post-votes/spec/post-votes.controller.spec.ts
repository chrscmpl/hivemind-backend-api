import { Test, TestingModule } from '@nestjs/testing';
import { PostVotesController } from '../post-votes.controller';
import { PostVotesService } from '../services/post-votes.service';

describe('VotesController', () => {
  let controller: PostVotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostVotesController],
      providers: [PostVotesService],
    }).compile();

    controller = module.get<PostVotesController>(PostVotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
