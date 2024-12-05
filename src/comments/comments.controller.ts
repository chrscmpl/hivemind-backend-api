import {
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentsFetchService } from './services/comments-fetch.service';
import { CommentsMutationService } from './services/comments-mutation.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BadRequestExceptionDto } from 'src/common/dto/exceptions/bad-request-exception.dto';
import { UnauthorizedExceptionDto } from 'src/common/dto/exceptions/unauthorized-exception.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  AuthenticatedUser,
  AuthUser,
} from 'src/common/decorators/auth-user.decorator';
import { catchError, map, Observable, throwError } from 'rxjs';
import { NotFoundExceptionDto } from 'src/common/dto/exceptions/not-found-exception.dto';
import { CommentDto } from './dto/comment.dto';

@ApiTags('Comments')
@ApiParam({ name: 'postId', description: "The post's ID",  required: true, type: 'number', example: 1 }) // prettier-ignore
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(
    private readonly commentsMutationService: CommentsMutationService,
    private readonly commentsFetchService: CommentsFetchService,
  ) {}

  @ApiOperation({
    summary: 'Create a comment',
    description: 'Requires authentication',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateCommentDto, required: true })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
    type: CommentDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters or payload.',
    type: BadRequestExceptionDto,
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authenticated.',
    type: UnauthorizedExceptionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
    type: NotFoundExceptionDto,
    example: { message: 'Post not found.', error: 'Not Found', statusCode: 404 }, // prettier-ignore
  })
  @Post()
  @UseGuards(AuthGuard())
  public create(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @AuthUser() user: AuthenticatedUser,
  ): Observable<CommentDto> {
    return this.commentsMutationService
      .create(createCommentDto, postId, user.id)
      .pipe(
        catchError(() =>
          throwError(() => new NotFoundException('Post not found.')),
        ),
        map((comment) => new CommentDto(comment)),
      );
  }
}
