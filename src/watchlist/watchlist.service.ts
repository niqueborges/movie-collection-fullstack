import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Watchlist } from './entities/watchlist.entity';
import { WatchlistMapper, WatchlistResponseDto } from './watchlist.mapper';

@Injectable()
export class WatchlistService {
  private readonly logger = new Logger(WatchlistService.name);

  constructor(
    @InjectRepository(Watchlist)
    private readonly watchlistRepository: Repository<Watchlist>,
  ) {}

  async addMovie(userId: string, movieId: string): Promise<WatchlistResponseDto> {
    this.logger.log(`Adding movie ${movieId} to watchlist for user ${userId}`);

    const exists = await this.watchlistRepository.findOne({
      where: { userId, movieId },
    });

    if (exists) {
      this.logger.warn(`Movie ${movieId} already exists in watchlist for user ${userId}`);
      throw new ConflictException('Movie already exists in watchlist');
    }

    const watchlist = this.watchlistRepository.create({ userId, movieId });
    const saved = await this.watchlistRepository.save(watchlist);

    this.logger.log(`Movie ${movieId} added to watchlist successfully for user ${userId}`);
    return WatchlistMapper.toDto(saved);
  }

  async findAll(userId: string, page = 1, limit = 10) {
    this.logger.log(`Fetching watchlist for user ${userId} - page ${page}, limit ${limit}`);

    const [data, total] = await this.watchlistRepository.findAndCount({
      where: { userId },
      relations: { movie: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    this.logger.log(`Found ${total} items in watchlist for user ${userId}`);
    return { total, page, limit, data: data.map(WatchlistMapper.toDto) };
  }

  async removeMovie(userId: string, movieId: string) {
    this.logger.log(`Removing movie ${movieId} from watchlist for user ${userId}`);

    const item = await this.watchlistRepository.findOne({
      where: { userId, movieId },
    });

    if (!item) {
      this.logger.warn(`Movie ${movieId} not found in watchlist for user ${userId}`);
      throw new NotFoundException('Movie not found in watchlist');
    }

    await this.watchlistRepository.remove(item);
    this.logger.log(`Movie ${movieId} removed from watchlist successfully for user ${userId}`);
    return { message: 'Movie removed successfully' };
  }
}