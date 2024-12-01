import { Module } from '@nestjs/common';
import { VotesService } from './services/votes.service';
import { VotesController } from './votes.controller';
import { CommonModule } from 'src/common/common.module';
import { VoteEntity } from './entities/vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([VoteEntity])],
  controllers: [VotesController],
  providers: [VotesService],
  exports: [TypeOrmModule],
})
export class VotesModule {}
