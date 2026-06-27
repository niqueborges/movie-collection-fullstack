import { Movie } from './entities/movie.entity';

export class MovieResponseDto {
  id: string;
  title: string;
  director?: string;
  description: string;
  releaseYear: number;
  genre: string;
  durationSeconds: number;
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export class MoviesMapper {
  static toDto(entity: Movie): MovieResponseDto {
    const dto = new MovieResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.director = entity.director;
    dto.description = entity.description;
    dto.releaseYear = entity.releaseYear;
    dto.genre = entity.genre;
    dto.durationSeconds = entity.durationSeconds;
    dto.averageRating = entity.averageRating;
    dto.totalReviews = entity.totalReviews;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  static toDtoList(entities: Movie[]): MovieResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
