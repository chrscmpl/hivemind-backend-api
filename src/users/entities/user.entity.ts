import { compare, hash } from 'src/common/helpers/hashing-utils.helper';
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
  public handle!: string;

  @Column()
  public displayName!: string;

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
  // @ts-expect-error disable ts(6133) from the option noUnusedLocals
  // the private method is actually used by the lifecycle decorator
  private afterLoad(): void {
    this.loadedPassword = this.password;
  }

  @BeforeInsert()
  // @ts-expect-error disable ts(6133) from the option noUnusedLocals
  // the private method is actually used by the lifecycle decorator
  private async beforeInsert(): Promise<void> {
    await this.hashPassword();
  }

  @BeforeUpdate()
  // @ts-expect-error disable ts(6133) from the option noUnusedLocals
  // the private method is actually used by the lifecycle decorator
  private async beforeUpdate(): Promise<void> {
    if (!this.password || this.password === this.loadedPassword) {
      return;
    }
    await this.hashPassword();
  }

  public async validatePassword(password: string): Promise<boolean> {
    if (!this.password) {
      throw new Error('UserEntity.validatePassword: Password is not set');
    }
    return compare(password, this.password);
  }

  private async hashPassword(): Promise<void> {
    this.password = await hash(this.password);
  }
}
