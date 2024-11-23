import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ValidationPipe,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthenticatedUser } from 'src/auth/entities/authenticated-user.entity';
import { OptionalAuthGuard } from 'src/auth/guards/optional-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { PostEntity } from './entities/post.entity';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { defaults, isNil, omitBy } from 'lodash';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostDto } from './dto/post.dto';
import { UnauthorizedExceptionDto } from 'src/common/dto/unauthorized-exception.dto';
import { PostPaginationDto } from './dto/post-pagination.dto';
import { NotFoundExceptionDto } from 'src/common/dto/not-found-exception.dto';
import { ForbiddenExceptionDto } from 'src/common/dto/forbidden-exception.dto';
import { BadRequestExceptionDto } from 'src/common/dto/bad-request-exception.dto';
import { getPostsPaginationIncludeQueryExamples } from './examples/posts-pagination-include-query.example';
import { getPostIncludeQueryExamples } from './examples/post-include-query.example';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly MAX_LIMIT = 100;

  public constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: 'Create a post',
    description: 'Requires authentication',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreatePostDto, required: true })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
    type: PostDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters or payload.',
    type: BadRequestExceptionDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    type: UnauthorizedExceptionDto,
  })
  @Post()
  @UseGuards(AuthGuard())
  public create(
    @Body(ValidationPipe) createPostDto: CreatePostDto,
    @AuthUser() user: AuthenticatedUser,
  ): Observable<PostDto> {
    return this.postsService
      .create(createPostDto, user.id)
      .pipe(map((post) => PostDto.fromEntity(post)));
  }

  @ApiOperation({
    summary: 'Paginated request for posts',
    description:
      'Posts do not contain their content by default, unless the "include" query parameter contains the value "content".<br/><br/>' +
      'Authentication is required for the value "ownVote" of the "include" query parameter to take effect.<br/><br/>',
  })
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1, default: 1, minimum: 1 }) // prettier-ignore
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 10, default: PostsController.DEFAULT_LIMIT, maximum: PostsController.MAX_LIMIT }) // prettier-ignore
  @ApiQuery({ name: 'include', description: 'comma-separated list of additional parameters', required: false, type: 'string', examples: getPostsPaginationIncludeQueryExamples() }) // prettier-ignore
  @ApiResponse({
    status: 200,
    description: 'The posts have been successfully found.',
    type: PostPaginationDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters or query parameters.',
    type: BadRequestExceptionDto,
  })
  @Get()
  @UseGuards(OptionalAuthGuard)
  public findAll(
    @AuthUser({ nullable: true }) user: AuthenticatedUser | null,
    @Query('include', new DefaultValuePipe('')) include: string = '',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(PostsController.DEFAULT_LIMIT), ParseIntPipe) // prettier-ignore
      limit: number = PostsController.DEFAULT_LIMIT, // prettier-ignore
  ): Observable<PostPaginationDto> {
    if (limit > PostsController.MAX_LIMIT) limit = PostsController.MAX_LIMIT;

    const includedFields: string[] = include.split(',');

    const includeVote: boolean = includedFields.includes('ownVote') && !!user;
    const includeContent: boolean = includedFields.includes('content');

    return this.postsService
      .paginate({
        page,
        limit,
        includeContent,
        includeVoteOf: includeVote ? user.id : null,
      })
      .pipe(map((pagination) => PostPaginationDto.fromPagination(pagination)));
  }

  @ApiOperation({
    summary: 'Find a post by ID',
    description:
      'Authentication is required for the value "ownVote" of the "include" query parameter to take effect.',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: 'number', example: 1 })
  @ApiQuery({ name: 'include', description: 'comma-separated list of additional parameters', required: false, type: 'string', examples: getPostIncludeQueryExamples() }) // prettier-ignore
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully found.',
    type: PostDto,
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
  public findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('include', new DefaultValuePipe('')) include: string = '',
    @AuthUser({ nullable: true }) user: AuthenticatedUser | null,
  ): Observable<PostDto> {
    const includedFields: string[] = include.split(',');

    const includeVote: boolean = includedFields.includes('ownVote') && !!user;

    return this.postsService
      .findOne(id, {
        relations: ['user'],
        includeVoteOf: includeVote ? user.id : null,
      })
      .pipe(
        map((post) => PostDto.fromEntity(post)),
        catchError(() => throwError(() => new NotFoundException())),
      );
  }

  @ApiOperation({
    summary: 'Update a post',
    description: 'Requires authorization',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: 'number', example: 1 })
  @ApiBody({ type: UpdatePostDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
    type: PostDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters or payload.',
    type: BadRequestExceptionDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    type: UnauthorizedExceptionDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
    type: ForbiddenExceptionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
    type: NotFoundExceptionDto,
  })
  @Patch(':id')
  @UseGuards(AuthGuard())
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @AuthUser() user: AuthenticatedUser,
  ): Observable<PostDto> {
    return this.checkAuthorization(id, user).pipe(
      switchMap((oldPost) =>
        this.postsService
          .update(id, updatePostDto)
          .pipe(
            map((newPost) =>
              PostDto.fromEntity(defaults(omitBy(newPost, isNil), oldPost)),
            ),
          ),
      ),
    );
  }

  @ApiOperation({
    summary: 'Delete a post',
    description: 'Requires authorization',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: 'number', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.',
    type: PostDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters.',
    type: BadRequestExceptionDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    type: UnauthorizedExceptionDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
    type: ForbiddenExceptionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
    type: NotFoundExceptionDto,
  })
  @Delete(':id')
  @UseGuards(AuthGuard())
  public remove(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: AuthenticatedUser,
  ): Observable<PostDto> {
    return this.checkAuthorization(id, user).pipe(
      switchMap((post) =>
        this.postsService.remove(id).pipe(map(() => PostDto.fromEntity(post))),
      ),
    );
  }

  private checkAuthorization(
    postId: number,
    user: AuthenticatedUser,
  ): Observable<PostEntity> {
    return this.postsService.findOne(postId).pipe(
      catchError(() => throwError(() => new NotFoundException())),
      tap((post) => {
        if (post.userId !== user.id) {
          throw new ForbiddenException();
        }
      }),
    );
  }
}
