import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  Repository,
} from 'typeorm';
import { VoteEntity } from '../../votes/entities/vote.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/posts/entities/post.entity';
// import { PostsService } from 'src/posts/services/posts.service';

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

  public async afterInsert(event: InsertEvent<PostEntity>) {
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
