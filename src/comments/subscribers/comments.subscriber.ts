import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/posts/entities/post.entity';
import { CommentEntity } from '../entities/comment.entity';

@EventSubscriber()
export class CommentsSubscriber
  implements EntitySubscriberInterface<CommentEntity>
{
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this);
  }

  public listenTo() {
    return CommentEntity;
  }

  public async afterInsert(event: InsertEvent<CommentEntity>) {
    const post = await this.getPost(event.entity);
    if (!post) {
      return;
    }
    post.commentCount++;
    this.updatePost(post);
  }

  public async afterRemove(event: RemoveEvent<CommentEntity>) {
    if (!event.entity) {
      throw new Error('Comments need to be loaded before being removed');
    }
    const post = await this.getPost(event.entity);
    if (!post) {
      return;
    }
    post.commentCount--;
    this.updatePost(post);
  }

  private async getPost(entity: CommentEntity) {
    return this.postsRepository.findOne({
      where: { id: entity.postId },
      select: ['id', 'commentCount'],
    });
  }

  private async updatePost(post: PostEntity) {
    return await this.postsRepository.update(post.id, {
      commentCount: post.commentCount,
      updatedAt: () => '"updatedAt"',
    });
  }
}
