import { Test, TestingModule } from '@nestjs/testing';
import { PostVotesService } from '../services/post-votes.service';

describe('VotesService', () => {
  let service: PostVotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostVotesService],
    }).compile();

    service = module.get<PostVotesService>(PostVotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
