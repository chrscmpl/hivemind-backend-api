import { compare, hash } from 'bcrypt';
import { PostEntity } from 'src/posts/entities/post.entity';
import {
  AfterLoad,
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

  private loadedPassword?: string;

  @AfterLoad()
  // @ts-expect-error disable ts(6133) from flag noUnusedLocals as the private method is used by the decorator
  private afterLoad(): void {
    this.loadedPassword = this.password;
  }

  @BeforeInsert()
  // @ts-expect-error disable ts(6133) from flag noUnusedLocals as the private method is used by the decorator
  private async beforeInsert(): Promise<void> {
    await this.hashPassword();
  }

  @BeforeUpdate()
  // @ts-expect-error disable ts(6133) from flag noUnusedLocals as the private method is used by the decorator
  private async beforeUpdate(): Promise<void> {
    if (!this.password || this.password === this.loadedPassword) {
      return;
    }
    await this.hashPassword();
  }

  public async validatePassword(plainPassword: string): Promise<boolean> {
    if (!this.password) {
      throw new Error('User.validatePassword: Password is not set');
    }
    return compare(plainPassword, this.password);
  }

  private async hashPassword(): Promise<void> {
    this.password = await hash(this.password, +process.env.SALT_ROUNDS!);
  }
}
