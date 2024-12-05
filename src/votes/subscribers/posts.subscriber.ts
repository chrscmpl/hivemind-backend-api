import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  Repository,
} from 'typeorm';
import { VoteEntity } from '../entities/vote.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/posts/entities/post.entity';

@EventSubscriber()
export class PostsSubscriber implements EntitySubscriberInterface<PostEntity> {
  constructor(
    @InjectRepository(VoteEntity)
    private readonly votesRepository: Repository<VoteEntity>,
    dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this);
  }

  public listenTo() {
    return PostEntity;
  }

  public afterInsert(event: InsertEvent<PostEntity>) {
    this.votesRepository.save(
      {
        userId: event.entity.userId,
        postId: event.entity.id,
        value: true,
      },
      { listeners: false },
    );
  }
}
