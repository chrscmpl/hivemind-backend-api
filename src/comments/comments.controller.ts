import { Controller } from '@nestjs/common';
import { CommentsFetchService } from './services/comments-fetch.service';

@Controller('comments')
export class CommentsController {
  // @ts-expect-error temporarily disable noUnusedLocals
  constructor(private readonly commentsService: CommentsFetchService) {}
}
