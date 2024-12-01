import { PostEntity } from 'src/posts/entities/post.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'post_votes' })
@Unique(['user', 'post'])
export class PostVoteEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'boolean', nullable: false })
  public value!: boolean;

  @Column({ name: 'userId', nullable: false })
  public userId!: number;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'userId' })
  public user!: UserEntity;

  @Column({ name: 'postId', nullable: false })
  public postId!: number;

  @ManyToOne(() => PostEntity, (post) => post.id, { nullable: false })
  @JoinColumn({ name: 'postId' })
  public post!: PostEntity;
}
