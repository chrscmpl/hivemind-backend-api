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
import { SignInDto } from './dto/signin.dto';
import { AuthService } from './services/auth.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { AuthenticatedUser } from './entities/authenticated-user.entity';
import { SignUpDto } from './dto/signup.dto';
import { AuthGuard } from './guards/auth.guard';
import { GrantAuthInterceptor } from './interceptors/grant-auth.interceptor';
import { omit } from 'lodash';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard())
  getAccountData(@AuthUser() user: AuthenticatedUser) {
    return omit(this.authService.getUserById(user.id), 'password');
  }

  @Post('signin')
  @UseInterceptors(GrantAuthInterceptor)
  @HttpCode(HttpStatus.OK)
  signin(@Body() signinDto: SignInDto): AuthenticatedUser {
    const user = this.authService.getUserByEmail(signinDto.email);
    if (!user || user.password !== signinDto.password) {
      throw new UnauthorizedException();
    }
    return AuthenticatedUser.fromUser(user);
  }

  @Post('signup')
  @UseInterceptors(GrantAuthInterceptor)
  signup(@Body(ValidationPipe) signupDto: SignUpDto): AuthenticatedUser {
    try {
      const user = this.authService.createUser(signupDto);
      return AuthenticatedUser.fromUser(user);
    } catch {
      throw new ConflictException();
    }
  }
}
