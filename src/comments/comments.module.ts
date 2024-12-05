import { Module } from '@nestjs/common';
import { CommentsFetchService } from './services/comments-fetch.service';
import { CommentsController } from './comments.controller';
import { CommentsMutationService } from './services/comments-mutation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { CommonModule } from 'src/common/common.module';
import { PostsModule } from 'src/posts/posts.module';
import { CommentsSubscriber } from './subscribers/comments.subscriber';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([CommentEntity]),
    PostsModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsFetchService,
    CommentsMutationService,
    CommentsSubscriber,
  ],
})
export class CommentsModule {}
