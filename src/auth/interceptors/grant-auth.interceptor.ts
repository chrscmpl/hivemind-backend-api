import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AuthenticatedUser } from '../entities/authenticated-user.entity';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

// Should only be applied to routes that return an AuthenticatedUser
@Injectable()
export class GrantAuthInterceptor implements NestInterceptor {
  public constructor(private readonly jwt: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: AuthenticatedUser) => {
        const res: Response = context.switchToHttp().getResponse();
        res.setHeader(
          'X-Set-Auth',
          this.jwt.sign({ sub: data.id, username: data.username }),
        );
        res['AuthRenewalDisabled'] = true;
      }),
    );
  }
}
