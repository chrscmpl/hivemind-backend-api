import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  public async getUser(id: number): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }

  public async login(email: string, password: string): Promise<UserEntity> {
    const user = await this.usersService.findOneByEmail(email);
    await this.validatePassword(password, user);
    return user;
  }

  public async signup(
    user: Parameters<UsersService['create']>[0],
  ): Promise<UserEntity> {
    return this.usersService.create(user);
  }

  public async signToken(user: UserEntity): Promise<string> {
    return this.jwt.signAsync({ sub: user.id });
  }

  private async validatePassword(
    password: string,
    user: UserEntity,
  ): Promise<void> {
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
  }
}
