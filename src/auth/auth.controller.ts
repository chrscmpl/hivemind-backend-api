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
} from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { UserService } from './services/user.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { AuthenticatedUser } from './entities/authenticated-user.entity';
import { SignUpDto } from './dto/signup.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() signinDto: SignInDto) {
    const user = this.userService.getByEmail(signinDto.email);
    if (!user || user.password !== signinDto.password) {
      throw new UnauthorizedException();
    }
  }

  @Post('signup')
  signup(@Body(ValidationPipe) signupDto: SignUpDto) {}

  @Get()
  @UseGuards(AuthGuard())
  getProfile(@AuthUser() user: AuthenticatedUser) {
    return user;
  }
}
