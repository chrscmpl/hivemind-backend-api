import {
  Controller,
  Get,
  Body,
  Put,
  UseGuards,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { VotesService } from './services/votes.service';
import { SetVoteDto } from './dto/set-vote.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  AuthenticatedUser,
  AuthUser,
} from 'src/common/decorators/auth-user.decorator';
import { VoteEnum } from './enum/vote.enum';
import { catchError, map, throwError } from 'rxjs';

@ApiTags('Votes')
@ApiParam({ name: 'id', description: 'The post ID',  required: true, type: 'number', example: 1 }) // prettier-ignore
@Controller('posts/:id')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Put('votes')
  @UseGuards(AuthGuard())
  public setVote(
    @AuthUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) postId: number,
    @Body() setVoteDto: SetVoteDto,
  ) {
    return (
      setVoteDto.vote === VoteEnum.NONE
        ? this.votesService.delete(user.id, postId)
        : this.votesService.set(user.id, postId, setVoteDto.vote)
    ).pipe(
      catchError(() => throwError(() => new NotFoundException())),
      map(() => ({ userId: user.id, postId, vote: setVoteDto.vote })),
    );
  }

  @Get('votes')
  public findAll() {}
}
