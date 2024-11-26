import { Controller, Get, Body, Put } from '@nestjs/common';
import { VotesService } from './services/votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Votes')
@ApiParam({ name: 'id', description: 'The post ID',  required: true, type: 'number', example: 1 }) // prettier-ignore
@Controller('posts/:id')
export class VotesController {
  // @ts-expect-error temporarily disable ts(6133) from flag noUnusedLocals
  constructor(private readonly votesService: VotesService) {}

  @Put('votes')
  create(@Body() createVoteDto: CreateVoteDto) {}

  @Get('votes')
  findAll() {}
}
