import { Test, TestingModule } from '@nestjs/testing';
import { PostsMutationService } from '../services/posts-mutation.service';

describe('PostsService', () => {
  let service: PostsMutationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsMutationService],
    }).compile();

    service = module.get<PostsMutationService>(PostsMutationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
