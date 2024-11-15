import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Get,
  UseGuards,
  ValidationPipe,
  UseInterceptors,
  ConflictException,
} from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { AuthService } from './services/auth.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { AuthenticatedUser } from './entities/authenticated-user.entity';
import { SignupDto } from './dto/signup.dto';
import { AuthGuard } from './guards/auth.guard';
import { GrantAuthInterceptor } from './interceptors/grant-auth.interceptor';
import { omit } from 'lodash';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard())
  public async getAccountData(
    @AuthUser() user: AuthenticatedUser,
  ): Promise<Omit<User, 'password'>> {
    return this.authService
      .getUserById(user.id)
      .then((user) => omit(user, 'password'))
      .catch(() => {
        throw new UnauthorizedException();
      });
  }

  @Post('signin')
  @UseInterceptors(GrantAuthInterceptor)
  @HttpCode(HttpStatus.OK)
  public async signin(
    @Body(ValidationPipe) signinDto: SigninDto,
  ): Promise<AuthenticatedUser> {
    return this.authService
      .getUserByEmail(signinDto.email)
      .then((user) => {
        if (!user || user.password !== signinDto.password) {
          throw new UnauthorizedException();
        }
        return AuthenticatedUser.fromUser(user);
      })
      .catch(() => {
        throw new UnauthorizedException();
      });
  }

  @Post('signup')
  @UseInterceptors(GrantAuthInterceptor)
  public async signup(
    @Body(ValidationPipe) signupDto: SignupDto,
  ): Promise<AuthenticatedUser> {
    return this.authService
      .createUser(signupDto)
      .then((user) => AuthenticatedUser.fromUser(user))
      .catch(() => {
        throw new ConflictException();
      });
  }
}
