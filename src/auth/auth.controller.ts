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
import {
  AuthUser,
  AuthenticatedUser,
} from '../common/decorators/auth-user.decorator';
import { SignupDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { PrivateUserDto } from './dto/private-user.dto';
import { AuthService } from './services/auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UnauthorizedExceptionDto } from 'src/common/dto/exceptions/unauthorized-exception.dto';
import { ConflictExceptionDto } from 'src/common/dto/exceptions/conflict-exception.dto';
import { BadRequestExceptionDto } from 'src/common/dto/exceptions/bad-request-exception.dto';
import { AuthTokenDto } from './dto/auth-token.dto';

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
    type: UnauthorizedExceptionDto,
  })
  @Get('account')
  @UseGuards(AuthGuard())
  public getAccountData(
    @AuthUser() user: AuthenticatedUser,
  ): Observable<PrivateUserDto> {
    return this.authService.getUser(user.id).pipe(
      catchError(() => throwError(() => new UnauthorizedException())),
      map((user) => new PrivateUserDto(user)),
    );
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
    type: BadRequestExceptionDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password.',
    type: UnauthorizedExceptionDto,
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: LoginDto): Observable<AuthTokenDto> {
    return this.authService.login(loginDto.email, loginDto.password).pipe(
      catchError(() => throwError(() => new UnauthorizedException())),
      switchMap((user) => this.authService.signToken(user)),
      map((token) => new AuthTokenDto(token)),
    );
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
    type: BadRequestExceptionDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email or username already exists.',
    type: ConflictExceptionDto,
  })
  @Post('signup')
  public signup(@Body() signupDto: SignupDto): Observable<AuthTokenDto> {
    return this.authService.signup(signupDto).pipe(
      catchError(() => throwError(() => new ConflictException())),
      switchMap((user) => this.authService.signToken(user)),
      map((token) => new AuthTokenDto(token)),
    );
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
    type: UnauthorizedExceptionDto,
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  public refresh(
    @AuthUser() user: AuthenticatedUser,
  ): Observable<AuthTokenDto> {
    return this.authService.getUser(user.id).pipe(
      catchError(() => throwError(() => new UnauthorizedException())),
      switchMap((user) => this.authService.signToken(user)),
      map((token) => new AuthTokenDto(token)),
    );
  }
}
