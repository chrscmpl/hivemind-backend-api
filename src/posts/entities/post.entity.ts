import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostVoteEntity } from 'src/votes/entities/vote.entity';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ nullable: false })
  public title!: string;

  @Column({ nullable: true, type: 'text' })
  public content?: string | null;

  @Column({ name: 'userId', nullable: false })
  public userId!: number;

  @ManyToOne(() => UserEntity, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'userId' })
  public user!: UserEntity;

  @Column({ default: 1, nullable: false })
  public upvoteCount!: number;

  @Column({ default: 0, nullable: false })
  public downvoteCount!: number;

  @OneToMany(() => PostVoteEntity, (vote) => vote.post)
  public votes!: PostVoteEntity[];

  public ownVote?: boolean;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
