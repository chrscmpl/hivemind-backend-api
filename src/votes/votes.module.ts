import { Module } from '@nestjs/common';
import { VotesService } from './services/votes.service';
import { VotesController } from './votes.controller';
import { CommonModule } from 'src/common/common.module';
import { VoteEntity } from './entities/vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesSubscriber } from './subscribers/votes.subscriber';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [CommonModule, PostsModule, TypeOrmModule.forFeature([VoteEntity])],
  controllers: [VotesController],
  providers: [VotesService, VotesSubscriber],
})
export class VotesModule {}
