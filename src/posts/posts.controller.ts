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
  UnauthorizedException,
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
import { Pagination } from 'nestjs-typeorm-paginate';
import { defaults, omit } from 'lodash';

@Controller('posts')
export class PostsController {
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly MAX_LIMIT = 100;

  public constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard())
  public create(
    @Body(ValidationPipe) createPostDto: CreatePostDto,
    @AuthUser() user: AuthenticatedUser,
  ): Observable<Omit<PostEntity, 'user'>> {
    return this.postsService
      .create(createPostDto, user.id)
      .pipe(map((post) => omit(post, 'user')));
  }

  @Get()
  @UseGuards(OptionalAuthGuard)
  public findAll(
    @AuthUser({ nullable: true }) user: AuthenticatedUser | null,
    @Query('include', new DefaultValuePipe('')) include: string = '',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(PostsController.DEFAULT_LIMIT), ParseIntPipe) // prettier-ignore
      limit: number = PostsController.DEFAULT_LIMIT, // prettier-ignore
  ): Observable<Pagination<PostEntity>> {
    if (limit > PostsController.MAX_LIMIT) limit = PostsController.MAX_LIMIT;

    const includeLike: boolean = include.includes('ownReaction');
    if (includeLike && !user) throw new UnauthorizedException();

    return this.postsService.paginate({ page, limit });
  }

  @Get(':id')
  public findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('include', new DefaultValuePipe('')) include: string = '',
    @AuthUser({ nullable: true }) user: AuthenticatedUser | null,
  ): Observable<PostEntity> {
    const includeLike: boolean = include.includes('ownReaction');
    if (includeLike && !user) throw new UnauthorizedException();
    return this.postsService
      .findOne(id)
      .pipe(catchError(() => throwError(() => new NotFoundException())));
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @AuthUser() user: AuthenticatedUser,
  ): Observable<PostEntity> {
    return this.checkAuthorization(id, user).pipe(
      switchMap((oldPost) =>
        this.postsService
          .update(id, updatePostDto)
          .pipe(map((newPost) => defaults(newPost, oldPost))),
      ),
    );
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  public remove(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: AuthenticatedUser,
  ): Observable<PostEntity> {
    return this.checkAuthorization(id, user).pipe(
      switchMap((post) => this.postsService.remove(id).pipe(map(() => post))),
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
