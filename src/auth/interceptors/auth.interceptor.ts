import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuthTokenPayload } from '../dto/auth-token-payload.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  public constructor(private readonly jwt: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      tap(() => {
        const http = context.switchToHttp();
        const req: Request = http.getRequest();
        const res: Response = http.getResponse();
        const authToken = req.user as AuthTokenPayload | null | undefined;
        const now = Date.now();
        if (
          authToken &&
          authToken.exp - now < (authToken.exp - authToken.iat) / 2
        ) {
          res.setHeader(
            'X-Set-Auth',
            this.jwt.sign(
              { sub: authToken.sub, username: authToken.username },
              {
                secret: process.env.AUTH_TOKEN_SECRET,
                expiresIn: process.env.AUTH_TOKEN_LIFE,
              },
            ),
          );
        }
      }),
    );
  }
}
