import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Get,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Auth, AuthUser } from '../common/decorators/auth.decorator';
import { SignupDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';
import { PrivateUserDto } from './dto/private-user.dto';
import { AuthService } from './services/auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthTokenDto } from './dto/auth-token.dto';
import { UnauthorizedExceptionExample } from 'src/common/examples/exceptions/unauthorized-exception.example';
import { BadRequestExceptionExample } from 'src/common/examples/exceptions/bad-request-exception.example';
import { ConflictExceptionExample } from 'src/common/examples/exceptions/conflict-exception.example';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Get the account data of the authenticated user',
    description: 'Requires authentication',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The account data has been successfully retrieved.',
    type: PrivateUserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authenticated.',
    example: UnauthorizedExceptionExample(),
  })
  @Get('me')
  @UseGuards(AuthGuard())
  public async getAccountData(@Auth() user: AuthUser): Promise<PrivateUserDto> {
    return this.authService
      .getUser(user.id)
      .catch(() => {
        throw new UnauthorizedException();
      })
      .then((user) => new PrivateUserDto(user));
  }

  @ApiOperation({ summary: 'Log in to an existing account' })
  @ApiBody({ type: LoginDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: AuthTokenDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload.',
    example: BadRequestExceptionExample(),
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password.',
    example: UnauthorizedExceptionExample('Invalid credentials'),
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto): Promise<AuthTokenDto> {
    return this.authService
      .login(loginDto.email, loginDto.password)
      .catch(() => {
        throw new UnauthorizedException('Invalid credentials');
      })
      .then((user) => this.authService.signToken(user))
      .then((token) => new AuthTokenDto(token));
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: SignupDto, required: true })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: AuthTokenDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload.',
    example: BadRequestExceptionExample(),
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email or username already exists.',
    example: ConflictExceptionExample(
      'User with this email or username already exists',
    ),
  })
  @Post('signup')
  public async signup(@Body() signupDto: SignupDto): Promise<AuthTokenDto> {
    return this.authService
      .signup(signupDto)
      .catch(() => {
        throw new ConflictException(
          'User with this email or username already exists',
        );
      })
      .then((user) => this.authService.signToken(user))
      .then((token) => new AuthTokenDto(token));
  }

  @ApiOperation({
    summary: 'Request access token renewal',
    description: 'Requires authentication',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'A new token has been issued.',
    type: AuthTokenDto,
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authenticated.',
    example: UnauthorizedExceptionExample(),
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  public async refresh(@Auth() user: AuthUser): Promise<AuthTokenDto> {
    return this.authService
      .getUser(user.id)
      .catch(() => {
        throw new UnauthorizedException();
      })
      .then((user) => this.authService.signToken(user))
      .then((token) => new AuthTokenDto(token));
  }
}
