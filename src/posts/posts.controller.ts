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
  ParseIntPipe,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PostsMutationService } from './services/posts-mutation.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  AuthUser,
  AuthenticatedUser,
} from 'src/common/decorators/auth-user.decorator';
import { OptionalAuthGuard } from 'src/common/guards/optional-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { PostEntity } from './entities/post.entity';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { defaults, isNil, omitBy } from 'lodash';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostDto } from './dto/post.dto';
import { PostPaginationDto } from './dto/post-pagination.dto';
import { PostsFetchService } from './services/posts-fetch.service';
import { noMsIso } from 'src/common/helpers/no-ms-iso.helper';
import { PostIncludeEnum } from './enum/post-include.enum';
import { PostPaginationQueryDto } from './dto/post-pagination-query.dto';
import { GetPostQueryDto } from './dto/get-post-query.dto';
import { getPostExample } from './examples/post.example';
import { getCreatedPostExample } from './examples/created-post.example';
import { BadRequestExceptionExample } from 'src/common/examples/exceptions/bad-request-exception.example';
import { UnauthorizedExceptionExample } from 'src/common/examples/exceptions/unauthorized-exception.example';
import { NotFoundExceptionExample } from 'src/common/examples/exceptions/not-found-exception.example';
import { ForbiddenExceptionExample } from 'src/common/examples/exceptions/forbidden-exception.example';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  public constructor(
    private readonly postsMutationService: PostsMutationService,
    private readonly postsFetchService: PostsFetchService,
  ) {}

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
    example: getCreatedPostExample(),
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
  @Post()
  @UseGuards(AuthGuard())
  public create(
    @Body() createPostDto: CreatePostDto,
    @AuthUser() user: AuthenticatedUser,
  ): Observable<PostDto> {
    return this.postsMutationService.create(createPostDto, user.id).pipe(
      map((post) => {
        post.myVote = true;
        return new PostDto(post);
      }),
    );
  }

  @ApiOperation({
    summary: 'Request for paginated  posts',
    description:
      'Posts do not contain their content by default, unless the "include" query parameter contains the value "content".<br/><br/>' +
      'Similarly, they only contain user data if the "include" query parameter contains the value "user" (except for the id).<br/><br/>' +
      'Authentication is required for the value "myVote" of the "include" query parameter to take effect.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The posts have been successfully found.',
    type: PostPaginationDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters or query parameters.',
    example: BadRequestExceptionExample(),
  })
  @Get()
  @UseGuards(OptionalAuthGuard)
  public findAll(
    @AuthUser({ nullable: true })
    user: AuthenticatedUser | null,
    @Query() query: PostPaginationQueryDto,
  ): Observable<PostPaginationDto> {
    const includeVote: boolean =
      query.include.includes(PostIncludeEnum.MY_VOTE) && !!user;
    const includeUser: boolean = query.include.includes(PostIncludeEnum.USER);

    const after = query.age ? new Date(Date.now() - query.age) : null;

    return this.postsFetchService
      .paginate({
        page: query.page,
        limit: query.limit,
        sort: query.sort,
        exclude: query.exclude,
        includeUser,
        after,
        includeVoteOf: includeVote ? user!.id : null,
      })
      .pipe(
        map((pagination) => {
          pagination.meta.sorting = query.sort;
          pagination.meta.after = after ? noMsIso(after) : null;
          pagination.meta.includes = query.include;
          return new PostPaginationDto(pagination);
        }),
      );
  }

  @ApiOperation({
    summary: 'Find a post by ID',
    description:
      'Authentication is required for the value "myVote" of the "include" query parameter to take effect.',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: 'number', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully found.',
    type: PostDto,
    example: getPostExample(),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters (id not numeric).',
    example: BadRequestExceptionExample(),
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    example: NotFoundExceptionExample(),
  })
  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  public findOne(
    @AuthUser({ nullable: true }) user: AuthenticatedUser | null,
    @Param('id', ParseIntPipe) id: number,
    @Query()
    query: GetPostQueryDto,
  ): Observable<PostDto> {
    const includeVote: boolean =
      query.include.includes(PostIncludeEnum.MY_VOTE) && !!user;

    const includeUser: boolean = query.include.includes(PostIncludeEnum.USER);

    return this.postsFetchService
      .findOne(id, {
        includeUser,
        includeVoteOf: includeVote ? user!.id : null,
        exclude: query.exclude,
      })
      .pipe(
        map((post) => new PostDto(post)),
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
    example: BadRequestExceptionExample(),
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authenticated.',
    example: UnauthorizedExceptionExample(),
  })
  @ApiResponse({
    status: 403,
    description: 'User is not the owner of the post.',
    example: ForbiddenExceptionExample(),
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
    example: NotFoundExceptionExample(),
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
        this.postsMutationService.update(id, updatePostDto).pipe(
          map(
            (newPost) =>
              // returns the updated post, adding the old values that were not updated
              new PostDto(defaults(omitBy(newPost, isNil), oldPost)),
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
    example: getPostExample(),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters.',
    example: BadRequestExceptionExample(),
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authenticated.',
    example: UnauthorizedExceptionExample(),
  })
  @ApiResponse({
    status: 403,
    description: 'User is not the owner of the post.',
    example: ForbiddenExceptionExample(),
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
    example: NotFoundExceptionExample(),
  })
  @Delete(':id')
  @UseGuards(AuthGuard())
  public remove(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: AuthenticatedUser,
  ): Observable<PostDto> {
    return this.checkAuthorization(id, user).pipe(
      switchMap((post) =>
        this.postsMutationService.delete(id).pipe(map(() => new PostDto(post))),
      ),
    );
  }

  private checkAuthorization(
    postId: number,
    user: AuthenticatedUser,
  ): Observable<PostEntity> {
    return this.postsFetchService.findOne(postId).pipe(
      catchError(() => throwError(() => new NotFoundException())),
      tap((post) => {
        if (post.userId !== user.id) {
          throw new ForbiddenException();
        }
      }),
    );
  }
}
