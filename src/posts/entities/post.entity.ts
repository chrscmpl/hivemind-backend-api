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

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: false })
  public title: string;

  @Column({ nullable: true })
  public content?: string | null;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'current_timestamp',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'current_timestamp',
    onUpdate: 'current_timestamp',
  })
  public updatedAt: Date;

  @Column({ name: 'user_id', nullable: false })
  public userId: number;

  @ManyToOne(() => UserEntity, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;
}
