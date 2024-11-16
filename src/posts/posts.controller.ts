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
} from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthenticatedUser } from 'src/auth/entities/authenticated-user.entity';
import { OptionalAuthGuard } from 'src/auth/guards/optional-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Post as PostEntity } from './entities/post.entity';
import { Observable } from 'rxjs';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(
    @Body() createPostDto: CreatePostDto,
    @AuthUser() user: AuthenticatedUser,
  ): Observable<PostEntity> {
    return this.postsService.create(createPostDto, user.id);
  }

  @Get()
  @UseGuards(OptionalAuthGuard)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('include', new DefaultValuePipe('')) include: string = '',
    @AuthUser({ nullable: true }) user: AuthenticatedUser | null,
  ): Observable<Pagination<PostEntity>> {
    const includeLike: boolean = include.includes('ownLike');
    if (includeLike && !user) throw new UnauthorizedException();

    return this.postsService.paginate({ page, limit });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('include', new DefaultValuePipe('')) include: string = '',
    @AuthUser({ nullable: true }) user: AuthenticatedUser | null,
  ) {
    const includeLike: boolean = include.includes('ownLike');
    if (includeLike && !user) throw new UnauthorizedException();
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
