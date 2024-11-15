import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './config/jwt-strategy.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RenewAuthInterceptor } from './interceptors/renew-auth.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.AUTH_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.AUTH_TOKEN_LIFE },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: RenewAuthInterceptor,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
