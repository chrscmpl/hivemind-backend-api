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
import { LoginDto } from './dto/login.dto';
import { AuthUser } from './decorators/auth-user.decorator';
import { AuthenticatedUser } from './entities/authenticated-user.entity';
import { SignupDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';
import { GrantAuthInterceptor } from './interceptors/grant-auth.interceptor';
import { catchError, Observable, throwError } from 'rxjs';
import { PrivateUserDto } from './dto/private-user.dto';
import { AuthService } from './services/auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UnauthorizedExceptionDto } from 'src/common/dto/unauthorized-exception.dto';
import { ConflictExceptionDto } from 'src/common/dto/conflict-exception.dto';
import { BadRequestExceptionDto } from 'src/common/dto/bad-request-exception.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Get the account data of the authenticated user',
    description: 'Requires authorization',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The account data has been successfully retrieved.',
    type: PrivateUserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedExceptionDto,
  })
  @Get()
  @UseGuards(AuthGuard())
  public getAccountData(
    @AuthUser() user: AuthenticatedUser,
  ): Observable<PrivateUserDto> {
    return this.authService
      .getSanitizedUser(user.id)
      .pipe(catchError(() => throwError(() => new UnauthorizedException())));
  }

  @ApiOperation({ summary: 'Log in to an existing account' })
  @ApiBody({ type: LoginDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: PrivateUserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload.',
    type: BadRequestExceptionDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password.',
    type: UnauthorizedExceptionDto,
  })
  @Post('login')
  @UseInterceptors(GrantAuthInterceptor)
  @HttpCode(HttpStatus.OK)
  public login(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Observable<PrivateUserDto> {
    return this.authService
      .login(loginDto.email, loginDto.password)
      .pipe(catchError(() => throwError(() => new UnauthorizedException())));
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: SignupDto, required: true })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: PrivateUserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload.',
    type: BadRequestExceptionDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email or username already exists.',
    type: ConflictExceptionDto,
  })
  @Post('signup')
  @UseInterceptors(GrantAuthInterceptor)
  public signup(
    @Body(ValidationPipe) signupDto: SignupDto,
  ): Observable<PrivateUserDto> {
    return this.authService
      .signup(signupDto)
      .pipe(catchError(() => throwError(() => new ConflictException())));
  }
}
