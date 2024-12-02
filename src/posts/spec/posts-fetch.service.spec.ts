import { Test, TestingModule } from '@nestjs/testing';
import { PostsFetchService } from '../services/posts-fetch.service';

describe('PostsService', () => {
  let service: PostsFetchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsFetchService],
    }).compile();

    service = module.get<PostsFetchService>(PostsFetchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
