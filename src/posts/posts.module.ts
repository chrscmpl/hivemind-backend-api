import { Module } from '@nestjs/common';
import { PostsMutationService } from './services/posts-mutation.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { CommonModule } from 'src/common/common.module';
import { PostsFetchService } from './services/posts-fetch.service';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostsController],
  providers: [PostsMutationService, PostsFetchService],
  exports: [TypeOrmModule],
})
export class PostsModule {}
