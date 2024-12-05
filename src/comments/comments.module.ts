import { Module } from '@nestjs/common';
import { CommentsFetchService } from './services/comments-fetch.service';
import { CommentsController } from './comments.controller';
import { CommentsMutationService } from './services/comments-mutation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([CommentEntity])],
  controllers: [CommentsController],
  providers: [CommentsFetchService, CommentsMutationService],
})
export class CommentsModule {}
