import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from './services/user.service';
import { JwtStrategy } from './config/jwt-strategy.config';
import { JwtConfigModule } from './jwt-config.module';

@Module({
  imports: [JwtConfigModule],
  controllers: [AuthController],
  providers: [UserService, JwtStrategy],
})
export class AuthModule {}
