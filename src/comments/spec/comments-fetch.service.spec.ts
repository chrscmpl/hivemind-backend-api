import { Test, TestingModule } from '@nestjs/testing';
import { CommentsFetchService } from '../services/comments-fetch.service';

describe('CommentsFetchService', () => {
  let service: CommentsFetchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentsFetchService],
    }).compile();

    service = module.get<CommentsFetchService>(CommentsFetchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
