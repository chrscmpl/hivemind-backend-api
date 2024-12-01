import { Module } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { CommonModule } from 'src/common/common.module';
import { PostVotesSubscriber } from './subscribers/post-votes.subscriber';
import { PostsSubscriber } from './subscribers/posts.subscriber';
import { PostVotesModule } from 'src/posts/modules/post-votes/post-votes.module';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([PostEntity]),
    PostVotesModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostVotesSubscriber, PostsSubscriber],
  exports: [PostVotesModule],
})
export class PostsModule {}
