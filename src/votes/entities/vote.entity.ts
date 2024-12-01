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

@Entity({ name: 'votes' })
@Unique(['user', 'post'])
export class VoteEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'boolean', nullable: false })
  public value!: boolean;

  @Column({ name: 'user_id', nullable: false })
  public userId!: number;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  public user!: UserEntity;

  @Column({ name: 'post_id', nullable: false })
  public postId!: number;

  @ManyToOne(() => PostEntity, (post) => post.id, { nullable: false })
  @JoinColumn({ name: 'post_id' })
  public post!: PostEntity;
}
