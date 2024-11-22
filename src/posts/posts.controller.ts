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
import { Post as PostEntity } from './entities/post.entity';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { Pagination } from 'nestjs-typeorm-paginate';
import { omit } from 'lodash';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('include', new DefaultValuePipe('')) include: string = '',
    @AuthUser({ nullable: true }) user: AuthenticatedUser | null,
  ): Observable<Pagination<PostEntity>> {
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
  ) {
    return this.checkAuthorization(id, user).pipe(
      switchMap(() => this.postsService.update(id, updatePostDto)),
    );
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  public remove(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: AuthenticatedUser,
  ) {
    return this.checkAuthorization(id, user).pipe(
      switchMap(() => this.postsService.remove(id)),
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
