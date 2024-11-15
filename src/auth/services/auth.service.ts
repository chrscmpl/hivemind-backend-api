import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, Observable } from 'rxjs';

@Injectable()
export class AuthService {
  public constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public getUserById(id: number): Observable<User> {
    return from(this.usersRepository.findOneBy({ id }));
  }

  public getUserByEmail(email: string): Observable<User> {
    return from(this.usersRepository.findOneBy({ email }));
  }

  public createUser(user: Omit<User, 'id'>): Observable<User> {
    return from(this.usersRepository.save(user));
  }
}
