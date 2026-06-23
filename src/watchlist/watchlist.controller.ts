import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { WatchlistService } from './watchlist.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { PaginationWatchlistDto } from './dto/pagination-watchlist.dto';

@Controller('watchlist')
export class WatchlistController {
  constructor(
    private readonly watchlistService: WatchlistService,
  ) {}

  @Post()
  addMovie(@Body() body: CreateWatchlistDto) {
    // Temporário até integrar com Auth
    const userId = 'temp-user-id';

    return this.watchlistService.addMovie(
      userId,
      body.movieId,
    );
  }

  @Get()
  findAll(
    @Query() query: PaginationWatchlistDto,
  ) {
    return this.watchlistService.findAll(
      query.page,
      query.limit,
    );
  }

  @Delete(':movieId')
  removeMovie(
    @Param('movieId') movieId: string,
  ) {
    return this.watchlistService.removeMovie(
      movieId,
    );
  }
}