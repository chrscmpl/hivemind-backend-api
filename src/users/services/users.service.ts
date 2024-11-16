import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { from, Observable } from 'rxjs';
import { PublicUser } from '../entities/public-user.entity';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public sanitizeUser(user: User): PublicUser {
    return PublicUser.fromUser(user);
  }

  public findOne(id: number): Observable<User> {
    return from(this.usersRepository.findOneBy({ id }));
  }

  public findOneByEmail(email: string): Observable<User> {
    return from(this.usersRepository.findOneBy({ email }));
  }

  public create(user: Omit<User, 'id' | 'posts'>): Observable<User> {
    const userEntity = this.usersRepository.create(user);
    return from(this.usersRepository.save(userEntity));
  }
}
