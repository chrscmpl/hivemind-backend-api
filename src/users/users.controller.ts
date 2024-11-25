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
import { NotFoundExceptionDto } from 'src/common/dto/exceptions/not-found-exception.dto';
import { BadRequestExceptionDto } from 'src/common/dto/exceptions/bad-request-exception.dto';

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
    type: BadRequestExceptionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    type: NotFoundExceptionDto,
  })
  @Get(':id')
  public findOne(@Param('id', ParseIntPipe) id: number): Observable<UserDto> {
    return this.usersService.findOne(id).pipe(
      map((user) => new UserDto(user)),
      catchError(() => throwError(() => new NotFoundException())),
    );
  }
}
