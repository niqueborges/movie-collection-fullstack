import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Watchlist } from './entities/watchlist.entity';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Watchlist)
    private readonly watchlistRepository: Repository<Watchlist>,
  ) {}

  async addMovie(userId: string, movieId: string) {
    const exists = await this.watchlistRepository.findOne({
      where: { userId, movieId },
    });

    if (exists) {
      throw new ConflictException('Movie already exists in watchlist');
    }

    const watchlist = this.watchlistRepository.create({ userId, movieId });
    return this.watchlistRepository.save(watchlist);
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const [data, total] = await this.watchlistRepository.findAndCount({
      where: { userId },
     relations: { movie: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { total, page, limit, data };
  }

  async removeMovie(userId: string, movieId: string) {
    const item = await this.watchlistRepository.findOne({
      where: { userId, movieId },
    });

    if (!item) {
      throw new NotFoundException('Movie not found in watchlist');
    }

    await this.watchlistRepository.remove(item);
    return { message: 'Movie removed successfully' };
  }
}