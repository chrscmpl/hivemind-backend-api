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
  public async create(
    @Body() createPostDto: CreatePostDto,
    @AuthUser() user: AuthenticatedUser,
  ): Promise<PostDto> {
    return this.postsMutationService
      .create(createPostDto, user.id)
      .then((post) => {
        post.myVote = true;
        return new PostDto(post);
      });
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
  public async findAll(
    @AuthUser({ nullable: true })
    user: AuthenticatedUser | null,
    @Query() query: PostPaginationQueryDto,
  ): Promise<PostPaginationDto> {
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
      .then((pagination) => {
        pagination.meta.sorting = query.sort;
        pagination.meta.after = after ? noMsIso(after) : null;
        pagination.meta.includes = query.include;
        return new PostPaginationDto(pagination);
      });
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
    description: 'Post not found.',
    example: NotFoundExceptionExample('Post not found'),
  })
  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  public async findOne(
    @AuthUser({ nullable: true }) user: AuthenticatedUser | null,
    @Param('id', ParseIntPipe) id: number,
    @Query()
    query: GetPostQueryDto,
  ): Promise<PostDto> {
    const includeVote: boolean =
      query.include.includes(PostIncludeEnum.MY_VOTE) && !!user;

    const includeUser: boolean = query.include.includes(PostIncludeEnum.USER);

    return this.postsFetchService
      .findOne(id, {
        includeUser,
        includeVoteOf: includeVote ? user!.id : null,
        exclude: query.exclude,
      })
      .catch(() => {
        throw new NotFoundException('Post not found');
      })
      .then((post) => new PostDto(post));
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
    description: 'User is not the author of the post.',
    example: ForbiddenExceptionExample('User is not the author of the post'),
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
    example: NotFoundExceptionExample('Post not found'),
  })
  @Patch(':id')
  @UseGuards(AuthGuard())
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @AuthUser() user: AuthenticatedUser,
  ): Promise<PostDto> {
    return this.checkAuthorization(id, user) //
      .then((oldPost) =>
        this.postsMutationService
          .update(id, updatePostDto) //
          .then(
            // returns the updated post, adding the old values that were not updated
            (newPost) => new PostDto(defaults(omitBy(newPost, isNil), oldPost)),
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
    description: 'User is not the author of the post.',
    example: ForbiddenExceptionExample('User is not the author of the post'),
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
    example: NotFoundExceptionExample('Post not found'),
  })
  @Delete(':id')
  @UseGuards(AuthGuard())
  public async remove(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: AuthenticatedUser,
  ): Promise<PostDto> {
    return this.checkAuthorization(id, user) //
      .then((post) =>
        this.postsMutationService
          .delete(id) //
          .then(() => new PostDto(post)),
      );
  }

  private async checkAuthorization(
    postId: number,
    user: AuthenticatedUser,
  ): Promise<PostEntity> {
    return this.postsFetchService
      .findOne(postId)
      .catch(() => {
        throw new NotFoundException('Post not found');
      })
      .then((post) => {
        if (post.userId !== user.id) {
          throw new ForbiddenException('User is not the author of the post');
        }
        return post;
      });
  }
}
