import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  public getById(id: string): User {
    return new User();
  }

  public getByEmail(email: string): User {
    return new User();
  }
}
