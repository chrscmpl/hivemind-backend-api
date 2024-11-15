import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from './services/user.service';
import { JwtStrategy } from './config/jwt-strategy.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.AUTH_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.AUTH_TOKEN_LIFE },
    }),
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
