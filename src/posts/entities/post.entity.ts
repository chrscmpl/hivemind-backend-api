import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: false })
  public title: string;

  @Column({ nullable: false })
  public content: string;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  public user: User;
}
