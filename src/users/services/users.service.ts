import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { from, Observable } from 'rxjs';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public sanitizeUser(user: UserEntity): UserDto {
    return UserDto.fromUser(user);
  }

  public findOne(id: number): Observable<UserEntity> {
    return from(this.usersRepository.findOneByOrFail({ id }));
  }

  public findOneByEmail(email: string): Observable<UserEntity> {
    return from(this.usersRepository.findOneByOrFail({ email }));
  }

  public create(
    user: Omit<UserEntity, 'id' | 'posts'>,
  ): Observable<UserEntity> {
    const userEntity = this.usersRepository.create(user);
    return from(this.usersRepository.save(userEntity));
  }
}
