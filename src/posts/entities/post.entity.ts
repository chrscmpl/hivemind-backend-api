import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: false })
  public title: string;

  @Column({ nullable: true })
  public content?: string | null;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;
}
