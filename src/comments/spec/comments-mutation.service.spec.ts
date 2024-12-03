import { Test, TestingModule } from '@nestjs/testing';
import { CommentsMutationService } from '../services/comments-mutation.service';

describe('CommentsMutationService', () => {
  let service: CommentsMutationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentsMutationService],
    }).compile();

    service = module.get<CommentsMutationService>(CommentsMutationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
