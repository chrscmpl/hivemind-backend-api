import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from '../common/jwt-strategy';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RenewAuthInterceptor } from './interceptors/renew-auth.interceptor';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: RenewAuthInterceptor,
    },
  ],
})
export class AuthModule {}
