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
import { PostVoteDto } from './dto/vote.dto';
import { NotFoundExceptionExample } from 'src/common/examples/exceptions/not-found-exception.example';
import { BadRequestExceptionExample } from 'src/common/examples/exceptions/bad-request-exception.example';

@ApiTags('Votes')
@ApiParam({ name: 'postId', description: "The post's ID",  required: true, type: 'number', example: 1 }) // prettier-ignore
@Controller('posts/:postId/votes')
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
    example: NotFoundExceptionExample('Post not found'),
  })
  @Put()
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  public async setVote(
    @AuthUser() user: AuthenticatedUser,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() setVoteDto: SetPostVoteDto,
  ): Promise<PostVoteDto> {
    return (
      setVoteDto.vote === PostVoteEnum.NONE
        ? this.votesService.delete(user.id, postId)
        : this.votesService.set(user.id, postId, setVoteDto.vote)
    )
      .catch(() => {
        throw new NotFoundException('Post not found');
      })
      .then(() => new PostVoteDto(user.id, postId, setVoteDto.vote));
  }
}
