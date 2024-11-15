import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './services/user.service';
import { JwtStrategy } from './config/jwt-strategy.config';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.AUTH_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.AUTH_TOKEN_LIFE },
    }),
  ],
  controllers: [AuthController],
  providers: [UserService, JwtStrategy],
})
export class AuthModule {}
