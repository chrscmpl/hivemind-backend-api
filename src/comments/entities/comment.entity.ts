import { PostEntity } from 'src/posts/entities/post.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ nullable: true, type: 'text' })
  public content?: string | null;

  @Column({ name: 'postId', nullable: false })
  public postId!: number;

  @ManyToOne(() => PostEntity, (post) => post.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  public post!: PostEntity;

  @Column({ name: 'userId', nullable: false })
  public userId!: number;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  public user!: UserEntity;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
