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
import { AuthUser } from './decorators/auth-user.decorator';
import { AuthenticatedUser } from './entities/authenticated-user.entity';
import { SignupDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';
import { GrantAuthInterceptor } from './interceptors/grant-auth.interceptor';
import { catchError, Observable, throwError } from 'rxjs';
import { SanitizedPrivateUserDto } from './dto/sanitized-private-user.dto';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard())
  public getAccountData(
    @AuthUser() user: AuthenticatedUser,
  ): Observable<SanitizedPrivateUserDto> {
    return this.authService
      .getSanitizedUser(user.id)
      .pipe(catchError(() => throwError(() => new UnauthorizedException())));
  }

  @Post('signin')
  @UseInterceptors(GrantAuthInterceptor)
  @HttpCode(HttpStatus.OK)
  public signin(
    @Body(ValidationPipe) signinDto: SigninDto,
  ): Observable<AuthenticatedUser> {
    return this.authService
      .signin(signinDto.email, signinDto.password)
      .pipe(catchError(() => throwError(() => new UnauthorizedException())));
  }

  @Post('signup')
  @UseInterceptors(GrantAuthInterceptor)
  public signup(
    @Body(ValidationPipe) signupDto: SignupDto,
  ): Observable<AuthenticatedUser> {
    return this.authService
      .signup(signupDto)
      .pipe(catchError(() => throwError(() => new ConflictException())));
  }
}
