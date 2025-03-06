import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  Repository,
  UpdateEvent,
} from 'typeorm';
import { VoteEntity } from '../entities/vote.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/posts/entities/post.entity';

@EventSubscriber()
export class VotesSubscriber implements EntitySubscriberInterface<VoteEntity> {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this);
  }

  public listenTo() {
    return VoteEntity;
  }

  public async afterInsert(event: InsertEvent<VoteEntity>) {
    const post = await this.getPost(event.entity);
    if (!post) {
      return;
    }
    if (event.entity.value) {
      post.upvoteCount++;
    } else {
      post.downvoteCount++;
    }
    this.updatePost(post);
  }

  public async afterUpdate(event: UpdateEvent<VoteEntity>) {
    if (!event.entity || !event.databaseEntity) {
      throw new Error('Votes need to be loaded before being updated');
    }
    const post = await this.getPost(event.entity as VoteEntity);
    if (!post) {
      return;
    }
    if (event.entity.value && !event.databaseEntity.value) {
      post.upvoteCount++;
      post.downvoteCount--;
    } else if (!event.entity.value && event.databaseEntity.value) {
      post.upvoteCount--;
      post.downvoteCount++;
    }
    this.updatePost(post);
  }

  public async afterRemove(event: RemoveEvent<VoteEntity>) {
    if (!event.entity) {
      throw new Error('Votes need to be loaded before being removed');
    }
    const post = await this.getPost(event.entity);
    if (!post) {
      return;
    }
    if (event.entity.value) {
      post.upvoteCount--;
    } else {
      post.downvoteCount--;
    }
    this.updatePost(post);
  }

  private async getPost(entity: VoteEntity) {
    return this.postsRepository.findOne({
      where: { id: entity.postId },
      select: ['id', 'upvoteCount', 'downvoteCount'],
    });
  }

  private async updatePost(post: PostEntity) {
    return await this.postsRepository.update(post.id, {
      upvoteCount: post.upvoteCount,
      downvoteCount: post.downvoteCount,
      updatedAt: () => '"updatedAt"',
    });
  }
}
