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
import { catchError, map, Observable, throwError } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard())
  public getAccountData(
    @AuthUser() user: AuthenticatedUser,
  ): Observable<Omit<User, 'password'>> {
    return this.authService.getUserById(user.id).pipe(
      map((user) => omit(user, 'password')),
      catchError(() => throwError(() => new UnauthorizedException())),
    );
  }

  @Post('signin')
  @UseInterceptors(GrantAuthInterceptor)
  @HttpCode(HttpStatus.OK)
  public signin(
    @Body(ValidationPipe) signinDto: SigninDto,
  ): Observable<AuthenticatedUser> {
    return this.authService.getUserByEmail(signinDto.email).pipe(
      map((user) => {
        if (user.password !== signinDto.password) {
          throw new UnauthorizedException();
        }
        return AuthenticatedUser.fromUser(user);
      }),
      catchError(() => throwError(() => new UnauthorizedException())),
    );
  }

  @Post('signup')
  @UseInterceptors(GrantAuthInterceptor)
  public signup(
    @Body(ValidationPipe) signupDto: SignupDto,
  ): Observable<AuthenticatedUser> {
    return this.authService.createUser(signupDto).pipe(
      map((user) => AuthenticatedUser.fromUser(user)),
      catchError(() => throwError(() => new ConflictException())),
    );
  }
}
