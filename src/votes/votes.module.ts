import { Module } from '@nestjs/common';
import { VotesService } from './services/votes.service';
import { VotesController } from './votes.controller';
import { CommonModule } from 'src/common/common.module';
import { PostVoteEntity } from './entities/vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from 'src/posts/posts.module';
import { VotesSubscriber } from './subscribers/votes.subscriber';
import { PostsSubscriber } from './subscribers/posts.subscriber';

@Module({
  imports: [
    CommonModule,
    PostsModule,
    TypeOrmModule.forFeature([PostVoteEntity]),
  ],
  controllers: [VotesController],
  providers: [VotesService, VotesSubscriber, PostsSubscriber],
})
export class VotesModule {}
