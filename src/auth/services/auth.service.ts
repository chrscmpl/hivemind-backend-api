import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { from, Observable, tap } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  public getUser(id: number): Observable<UserEntity> {
    return this.usersService.findOne(id);
  }

  public login(email: string, password: string): Observable<UserEntity> {
    return this.usersService.findOneByEmail(email).pipe(
      tap((user) => {
        if (user.password !== password) throw new Error('Invalid password');
      }),
    );
  }

  public signup(
    user: Parameters<UsersService['create']>[0],
  ): Observable<UserEntity> {
    return this.usersService.create(user);
  }

  public signToken(user: UserEntity): Observable<string> {
    return from(this.jwt.signAsync({ sub: user.id, username: user.username }));
  }
}
