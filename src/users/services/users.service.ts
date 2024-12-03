import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { from, Observable } from 'rxjs';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public findOne(id: number): Observable<UserEntity> {
    return from(this.usersRepository.findOneByOrFail({ id }));
  }

  public findOneByEmail(email: string): Observable<UserEntity> {
    return from(this.usersRepository.findOneByOrFail({ email }));
  }

  public create(
    user: Omit<
      UserEntity,
      | 'id'
      | 'posts'
      | 'postVotes'
      | 'createdAt'
      | 'updatedAt'
      | 'validatePassword'
    >,
  ): Observable<UserEntity> {
    const userEntity = this.usersRepository.create(user);
    return from(this.usersRepository.save(userEntity));
  }
}
