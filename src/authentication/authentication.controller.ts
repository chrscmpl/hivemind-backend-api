import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { LoginDto } from './dto/login.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/login')
  login(@Body() createAuthenticationDto: LoginDto) {}
}
