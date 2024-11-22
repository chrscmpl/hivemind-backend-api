import { Injectable } from '@nestjs/common';
import { PrivateUserDto } from '../dto/private-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { map, Observable } from 'rxjs';

@Injectable()
export class AuthService {
  public constructor(private readonly usersService: UsersService) {}

  public sanitizeUser(user: UserEntity): PrivateUserDto {
    return PrivateUserDto.fromUser(user);
  }

  public getSanitizedUser(id: number): Observable<PrivateUserDto> {
    return this.usersService
      .findOne(id)
      .pipe(map((user) => this.sanitizeUser(user)));
  }

  public login(email: string, password: string): Observable<PrivateUserDto> {
    return this.usersService.findOneByEmail(email).pipe(
      map((user) => {
        if (user.password !== password) {
          throw new Error('Invalid password');
        }
        return PrivateUserDto.fromUser(user);
      }),
    );
  }

  public signup(
    user: Parameters<UsersService['create']>[0],
  ): Observable<PrivateUserDto> {
    return this.usersService
      .create(user)
      .pipe(map((user) => PrivateUserDto.fromUser(user)));
  }
}
