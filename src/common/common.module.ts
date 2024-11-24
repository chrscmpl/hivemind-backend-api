import { Module } from '@nestjs/common';
import { JwtStrategy } from './config/jwt-strategy.config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.AUTH_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.AUTH_TOKEN_LIFE },
    }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class CommonModule {}
