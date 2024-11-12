import { Module } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './services/user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_LIFE },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UserService],
})
export class AuthenticationModule {}
