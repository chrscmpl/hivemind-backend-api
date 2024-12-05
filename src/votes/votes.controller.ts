import {
  Controller,
  Body,
  Put,
  UseGuards,
  Param,
  ParseIntPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VotesService } from './services/votes.service';
import { SetPostVoteDto } from './dto/set-vote.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  AuthenticatedUser,
  AuthUser,
} from 'src/common/decorators/auth-user.decorator';
import { PostVoteEnum } from './enum/vote.enum';
import { catchError, map, Observable, throwError } from 'rxjs';
import { PostVoteDto } from './dto/vote.dto';
import { NotFoundExceptionExample } from 'src/common/examples/exceptions/not-found-exception.example';
import { BadRequestExceptionExample } from 'src/common/examples/exceptions/bad-request-exception.example';

@ApiTags('Votes')
@ApiParam({ name: 'id', description: "The post's ID",  required: true, type: 'number', example: 1 }) // prettier-ignore
@Controller('posts/:id')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @ApiOperation({
    summary: 'Set a vote for a post',
    description: 'Requires authentication',
  })
  @ApiBearerAuth()
  @ApiBody({ type: SetPostVoteDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'The vote has been successfully set.',
    type: PostVoteDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters or payload.',
    example: BadRequestExceptionExample(),
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
    example: NotFoundExceptionExample(),
  })
  @Put('votes')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  public setVote(
    @AuthUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) postId: number,
    @Body() setVoteDto: SetPostVoteDto,
  ): Observable<PostVoteDto> {
    return (
      setVoteDto.vote === PostVoteEnum.NONE
        ? this.votesService.delete(user.id, postId)
        : this.votesService.set(user.id, postId, setVoteDto.vote)
    ).pipe(
      catchError(() => throwError(() => new NotFoundException())),
      map(() => new PostVoteDto(user.id, postId, setVoteDto.vote)),
    );
  }
}
