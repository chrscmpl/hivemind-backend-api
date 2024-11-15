import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  public getUserById(id: string): User {
    return new User();
  }

  public getUserByEmail(email: string): User {
    return new User();
  }

  public createUser(user: Omit<User, 'id'>): User {
    return { ...user, id: 1 };
  }
}
