import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  Repository,
  UpdateEvent,
} from 'typeorm';
import { PostVoteEntity } from '../modules/post-votes/entities/post-vote.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/posts/entities/post.entity';

@EventSubscriber()
export class PostVotesSubscriber
  implements EntitySubscriberInterface<PostVoteEntity>
{
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this);
  }

  public listenTo() {
    return PostVoteEntity;
  }

  public async afterInsert(event: InsertEvent<PostVoteEntity>) {
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

  public async afterUpdate(event: UpdateEvent<PostVoteEntity>) {
    if (!event.entity || !event.databaseEntity) {
      throw new Error('Votes need to be loaded before being updated');
    }
    const post = await this.getPost(event.entity as PostVoteEntity);
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

  public async afterRemove(event: RemoveEvent<PostVoteEntity>) {
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

  private async getPost(entity: PostVoteEntity) {
    return this.postsRepository.findOne({
      where: { id: entity.postId },
      select: ['id', 'upvoteCount', 'downvoteCount'],
    });
  }
}
