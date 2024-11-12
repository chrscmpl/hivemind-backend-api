import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { LoginDto } from './dto/login.dto';
import { UserService } from './services/user.service';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): { token: string } {
    const user = this.userService.getByEmail(loginDto.email);
    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException();
    }
    const token = this.authenticationService.generateToken(user.id);
    return { token };
  }
}
