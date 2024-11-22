import { Injectable } from '@nestjs/common';
import { SanitizedPrivateUserDto } from '../dto/sanitized-private-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { map, Observable } from 'rxjs';
import { AuthenticatedUser } from '../entities/authenticated-user.entity';

@Injectable()
export class AuthService {
  public constructor(private readonly usersService: UsersService) {}

  public sanitizeUser(user: UserEntity): SanitizedPrivateUserDto {
    return SanitizedPrivateUserDto.fromUser(user);
  }

  public getSanitizedUser(id: number): Observable<SanitizedPrivateUserDto> {
    return this.usersService
      .findOne(id)
      .pipe(map((user) => this.sanitizeUser(user)));
  }

  public signin(
    email: string,
    password: string,
  ): Observable<AuthenticatedUser> {
    return this.usersService.findOneByEmail(email).pipe(
      map((user) => {
        if (user.password !== password) {
          throw new Error('Invalid password');
        }
        return AuthenticatedUser.fromUser(user);
      }),
    );
  }

  public signup(
    user: Parameters<UsersService['create']>[0],
  ): Observable<AuthenticatedUser> {
    return this.usersService
      .create(user)
      .pipe(map((user) => AuthenticatedUser.fromUser(user)));
  }
}
