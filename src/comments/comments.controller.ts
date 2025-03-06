import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
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
import { AuthGuard } from '@nestjs/passport';
import { AuthUser, Auth } from 'src/common/decorators/auth.decorator';
import { CommentDto } from './dto/comment.dto';
import { BadRequestExceptionExample } from 'src/common/examples/exceptions/bad-request-exception.example';
import { UnauthorizedExceptionExample } from 'src/common/examples/exceptions/unauthorized-exception.example';
import { NotFoundExceptionExample } from 'src/common/examples/exceptions/not-found-exception.example';
import { CommentPaginationDto } from './dto/comment-pagination.dto';
import { noMsIso } from 'src/common/helpers/no-ms-iso.helper';
import { CommentsPaginationQueryDto } from './dto/comment-pagination-query.dto';
import { CommentIncludeEnum } from './enum/comment-include.enum';

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
    example: BadRequestExceptionExample(),
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authenticated.',
    example: UnauthorizedExceptionExample(),
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
    example: NotFoundExceptionExample('Post not found'),
  })
  @Post()
  @UseGuards(AuthGuard())
  public async create(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Auth() user: AuthUser,
  ): Promise<CommentDto> {
    return this.commentsMutationService
      .create(createCommentDto, postId, user.id)
      .catch(() => {
        throw new NotFoundException('Post not found');
      })
      .then((comment) => new CommentDto(comment));
  }

  @ApiOperation({
    summary: 'Request for paginated comments',
    description:
      'Comments contain user data only if the include query parameter contains the string "user".<br/><br/>',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The comments have been successfully found.',
    type: CommentPaginationDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters or query parameters.',
    example: BadRequestExceptionExample(),
  })
  @Get()
  public async findAll(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: CommentsPaginationQueryDto,
  ): Promise<CommentPaginationDto> {
    const includeUser: boolean = query.include.includes(
      CommentIncludeEnum.USER,
    );

    const after = query.age ? new Date(Date.now() - query.age) : null;

    const pagination = await this.commentsFetchService.paginate({
      page: query.page,
      limit: query.limit,
      postId,
      exclude: query.exclude,
      includeUser,
      after,
    });

    pagination.meta.after = after ? noMsIso(after) : null;
    pagination.meta.includes = query.include;
    return new CommentPaginationDto(pagination);
  }
}
