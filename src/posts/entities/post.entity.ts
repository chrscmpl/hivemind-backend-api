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

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ nullable: false })
  public title!: string;

  @Column({ nullable: true, type: 'text' })
  public content?: string | null;

  @Column({ name: 'user_id', nullable: false })
  public userId!: number;

  @ManyToOne(() => UserEntity, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  public user!: UserEntity;

  @Column({ name: 'upvote_count', default: 1, nullable: false })
  public upvoteCount!: number;

  @Column({ name: 'downvote_count', default: 0, nullable: false })
  public downvoteCount!: number;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
