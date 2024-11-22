import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './services/users.service';
import { PublicUserDto } from './dto/public-user.dto';
import { Observable, catchError, map, throwError } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  public findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<PublicUserDto> {
    return this.usersService.findOne(id).pipe(
      map((user) => this.usersService.sanitizeUser(user)),
      catchError(() => throwError(() => new NotFoundException())),
    );
  }
}
