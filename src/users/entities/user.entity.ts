import { compare, genSalt, hash } from 'bcrypt';
import { PostEntity } from 'src/posts/entities/post.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ unique: true })
  public username!: string;

  @Column({ unique: true })
  public email!: string;

  @Column()
  public password!: string;

  @OneToMany(() => PostEntity, (post) => post.user)
  public posts!: PostEntity[];

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword(): Promise<void> {
    if (!this.password) return;
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
  }

  public async validatePassword(plainPassword: string): Promise<boolean> {
    return compare(plainPassword, this.password);
  }
}
