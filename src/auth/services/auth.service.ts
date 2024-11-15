import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  public constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public getUserById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  public getUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  public createUser(user: Omit<User, 'id'>): Promise<User> {
    return this.usersRepository.save(user);
  }
}
