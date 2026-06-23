import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { WatchlistService } from './watchlist.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { PaginationWatchlistDto } from './dto/pagination-watchlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('watchlist')
export class WatchlistController {
  constructor(
    private readonly watchlistService: WatchlistService,
  ) {}

  @Post()
  addMovie(
    @Request() req,
    @Body() body: CreateWatchlistDto,
  ) {
    return this.watchlistService.addMovie(
      req.user.id,
      body.movieId,
    );
  }

  @Get()
  findAll(
    @Request() req,
    @Query() query: PaginationWatchlistDto,
  ) {
    return this.watchlistService.findAll(
      req.user.id,
      query.page,
      query.limit,
    );
  }

  @Delete(':movieId')
  removeMovie(
    @Request() req,
    @Param('movieId') movieId: string,
  ) {
    return this.watchlistService.removeMovie(
      req.user.id,
      movieId,
    );
  }
}