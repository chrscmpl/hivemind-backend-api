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
import { omit } from 'lodash';

@Injectable()
export class RenewAuthInterceptor implements NestInterceptor {
  public constructor(private readonly jwt: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      tap(() => {
        const http = context.switchToHttp();
        const req: Request = http.getRequest();
        const res: Response = http.getResponse();
        const authToken = req.user as AuthTokenPayload | null | undefined; // set by AuthGuard
        const now = Date.now() / 1000;
        if (
          !res['AuthRenewalDisabled'] && // set by GrantAuthInterceptor
          authToken &&
          authToken.exp - now < (authToken.exp - authToken.iat) / 2
        ) {
          res.setHeader(
            'X-Set-Auth',
            this.jwt.sign(omit(authToken, ['iat', 'exp'])),
          );
        }
      }),
    );
  }
}
