import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(private readonly jwt: JwtService) {}

  public generateToken(id: string | number): string {
    return this.jwt.sign({ sub: id });
  }

  public verifyToken(token: string): string {
    return this.jwt.verify<{ sub: string }>(token).sub;
  }
}
