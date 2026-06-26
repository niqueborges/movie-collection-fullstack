import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
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
  private readonly logger = new Logger(WatchlistController.name);

  constructor(
    private readonly watchlistService: WatchlistService,
  ) {}

  @Post()
  addMovie(
    @Request() req,
    @Body() body: CreateWatchlistDto,
  ) {
    this.logger.log(`POST /watchlist - user ${req.user.id} adding movie ${body.movieId}`);
    return this.watchlistService.addMovie(req.user.id, body.movieId);
  }

  @Get()
  findAll(
    @Request() req,
    @Query() query: PaginationWatchlistDto,
  ) {
    this.logger.log(`GET /watchlist - user ${req.user.id} - page ${query.page}, limit ${query.limit}`);
    return this.watchlistService.findAll(req.user.id, query.page, query.limit);
  }

  @Delete(':movieId')
  removeMovie(
    @Request() req,
    @Param('movieId') movieId: string,
  ) {
    this.logger.log(`DELETE /watchlist/${movieId} - user ${req.user.id}`);
    return this.watchlistService.removeMovie(req.user.id, movieId);
  }
}