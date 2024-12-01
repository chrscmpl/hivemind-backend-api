import { Module } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { CommonModule } from 'src/common/common.module';
import { VotesSubscriber } from './subscribers/votes.subscriber';
import { PostsSubscriber } from './subscribers/posts.subscriber';
import { VotesModule } from 'src/votes/votes.module';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([PostEntity]), VotesModule],
  controllers: [PostsController],
  providers: [PostsService, VotesSubscriber, PostsSubscriber],
})
export class PostsModule {}
