import { Controller } from '@nestjs/common';
import { CommentsFetchService } from './services/comments-fetch.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsFetchService) {}
}
