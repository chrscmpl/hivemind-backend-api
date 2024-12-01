import { Module } from '@nestjs/common';
import { PostVotesService } from './services/post-votes.service';
import { PostVotesController } from './post-votes.controller';
import { CommonModule } from 'src/common/common.module';
import { PostVoteEntity } from './entities/post-vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([PostVoteEntity])],
  controllers: [PostVotesController],
  providers: [PostVotesService],
  exports: [TypeOrmModule],
})
export class PostVotesModule {}
