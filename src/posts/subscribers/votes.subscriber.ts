import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  Repository,
  UpdateEvent,
} from 'typeorm';
import { VoteEntity } from '../../votes/entities/vote.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/posts/entities/post.entity';
// import { PostsService } from 'src/posts/services/posts.service';

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
    this.postsRepository.save(post);
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
    this.postsRepository.save(post);
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
    this.postsRepository.save(post);
  }

  private async getPost(entity: VoteEntity) {
    return this.postsRepository.findOne({
      where: { id: entity.postId },
      select: ['id', 'upvoteCount', 'downvoteCount'],
    });
  }
}
