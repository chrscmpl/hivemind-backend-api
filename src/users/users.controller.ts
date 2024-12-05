import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UserDto } from './dto/user.dto';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestExceptionExample } from 'src/common/examples/exceptions/bad-request-exception.example';
import { NotFoundExceptionExample } from 'src/common/examples/exceptions/not-found-exception.example';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiParam({ name: 'id', required: true, type: 'number', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully found.',
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters (id not numeric).',
    example: BadRequestExceptionExample(),
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    example: NotFoundExceptionExample('User not found'),
  })
  @Get(':id')
  public findOne(@Param('id', ParseIntPipe) id: number): Observable<UserDto> {
    return this.usersService.findOne(id).pipe(
      catchError(() =>
        throwError(() => new NotFoundException('User not found')),
      ),
      map((user) => new UserDto(user)),
    );
  }
}
