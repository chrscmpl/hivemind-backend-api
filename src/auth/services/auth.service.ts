import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  public getUserById(id: number): User {
    return new User();
  }

  public getUserByEmail(email: string): User {
    return new User();
  }

  public createUser(user: Omit<User, 'id'>): User {
    throw new Error('Method not implemented.');
    return { ...user, id: 1 };
  }
}
