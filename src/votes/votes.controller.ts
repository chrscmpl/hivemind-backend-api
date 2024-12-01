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
import { SetVoteDto } from './dto/set-vote.dto';
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
import { VoteEnum } from './enum/vote.enum';
import { catchError, map, Observable, throwError } from 'rxjs';
import { VoteDto } from './dto/vote.dto';
import { NotFoundExceptionDto } from 'src/common/dto/exceptions/not-found-exception.dto';

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
  @ApiBody({ type: SetVoteDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'The vote has been successfully set.',
    type: VoteDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
    type: NotFoundExceptionDto,
  })
  @Put('votes')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  public setVote(
    @AuthUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) postId: number,
    @Body() setVoteDto: SetVoteDto,
  ): Observable<VoteDto> {
    return (
      setVoteDto.vote === VoteEnum.NONE
        ? this.votesService.delete(user.id, postId)
        : this.votesService.set(user.id, postId, setVoteDto.vote)
    ).pipe(
      catchError(() => throwError(() => new NotFoundException())),
      map(() => new VoteDto(user.id, postId, setVoteDto.vote)),
    );
  }
}
