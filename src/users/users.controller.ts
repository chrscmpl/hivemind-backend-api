import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { PublicUser } from './entities/public-user.entity';
import { Observable, catchError, map, throwError } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  public findOne(@Param('id') id: string): Observable<PublicUser> {
    return this.usersService.findOne(+id).pipe(
      map((user) => this.usersService.sanitizeUser(user)),
      catchError(() => throwError(() => new NotFoundException())),
    );
  }
}
