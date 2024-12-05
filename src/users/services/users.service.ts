import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public async findOne(id: number): Promise<UserEntity> {
    return this.usersRepository.findOneByOrFail({ id });
  }

  public async findOneByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOneByOrFail({ email });
  }

  public async create(
    user: Omit<
      UserEntity,
      | 'id'
      | 'posts'
      | 'comments'
      | 'votes'
      | 'createdAt'
      | 'updatedAt'
      | 'validatePassword'
    >,
  ): Promise<UserEntity> {
    const userEntity = this.usersRepository.create(user);
    return this.usersRepository.save(userEntity);
  }
}
