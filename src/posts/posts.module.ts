import { Module } from '@nestjs/common';
import { PostsMutationService } from './services/posts-mutation.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { CommonModule } from 'src/common/common.module';
import { PostVotesSubscriber } from './subscribers/post-votes.subscriber';
import { PostsSubscriber } from './subscribers/posts.subscriber';
import { PostVotesModule } from 'src/posts/modules/post-votes/post-votes.module';
import { PostsFetchService } from './services/posts-fetch.service';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([PostEntity]),
    PostVotesModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsMutationService,
    PostsFetchService,
    PostVotesSubscriber,
    PostsSubscriber,
  ],
  exports: [PostVotesModule],
})
export class PostsModule {}
