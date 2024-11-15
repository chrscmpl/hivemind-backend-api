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
} from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { AuthService } from './services/auth.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { AuthenticatedUser } from './entities/authenticated-user.entity';
import { SignUpDto } from './dto/signup.dto';
import { AuthGuard } from './guards/auth.guard';
import { GrantAuthInterceptor } from './interceptors/grant-auth.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard())
  getProfile(@AuthUser() user: AuthenticatedUser) {
    return user;
  }

  @Post('signin')
  @UseInterceptors(GrantAuthInterceptor)
  @HttpCode(HttpStatus.OK)
  signin(@Body() signinDto: SignInDto): AuthenticatedUser {
    const user = this.userService.getUserByEmail(signinDto.email);
    if (!user || user.password !== signinDto.password) {
      throw new UnauthorizedException();
    }

    return { id: user.id, username: user.username };
  }

  @Post('signup')
  @UseInterceptors(GrantAuthInterceptor)
  signup(@Body(ValidationPipe) signupDto: SignUpDto): AuthenticatedUser {
    const user = this.userService.createUser(signupDto);
    return { id: user.id, username: user.username };
  }
}
