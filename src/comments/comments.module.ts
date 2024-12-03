import { Module } from '@nestjs/common';
import { CommentsFetchService } from './services/comments-fetch.service';
import { CommentsController } from './comments.controller';

@Module({
  controllers: [CommentsController],
  providers: [CommentsFetchService],
})
export class CommentsModule {}
