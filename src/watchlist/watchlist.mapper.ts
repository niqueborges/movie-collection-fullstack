import { Watchlist } from './entities/watchlist.entity';
import { MovieResponseDto, MoviesMapper } from '../movies/movies.mapper';

export class WatchlistResponseDto {
  id: string;
  userId: string;
  movieId: string;
  movie?: MovieResponseDto;
  createdAt: Date;
  updatedAt: Date;
}

export class WatchlistMapper {
  static toDto(entity: Watchlist): WatchlistResponseDto {
    const dto = new WatchlistResponseDto();
    dto.id = entity.id;
    dto.userId = entity.userId;
    dto.movieId = entity.movieId;
    dto.movie = entity.movie ? MoviesMapper.toDto(entity.movie) : undefined;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}