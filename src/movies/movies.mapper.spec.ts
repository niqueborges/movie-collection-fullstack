import { MoviesMapper } from './movies.mapper';
import { Movie } from './entities/movie.entity';

describe('MoviesMapper', () => {
  it('should map entity to dto', () => {
    const movieEntity = new Movie();
    movieEntity.id = 'uuid';
    movieEntity.title = 'Inception';
    movieEntity.description = 'Dream within a dream';
    movieEntity.releaseYear = 2010;
    movieEntity.genre = 'Sci-Fi';
    movieEntity.durationSeconds = 8880;
    movieEntity.averageRating = 5;
    movieEntity.totalReviews = 100;
    movieEntity.createdAt = new Date('2020-01-01');
    movieEntity.updatedAt = new Date('2020-01-02');

    const dto = MoviesMapper.toDto(movieEntity);
    expect(dto.id).toBe('uuid');
    expect(dto.title).toBe('Inception');
    expect(dto.description).toBe('Dream within a dream');
    expect(dto.releaseYear).toBe(2010);
    expect(dto.genre).toBe('Sci-Fi');
    expect(dto.durationSeconds).toBe(8880);
    expect(dto.averageRating).toBe(5);
    expect(dto.totalReviews).toBe(100);
    expect(dto.createdAt).toEqual(new Date('2020-01-01'));
    expect(dto.updatedAt).toEqual(new Date('2020-01-02'));
  });

  it('should map list of entities to list of dtos', () => {
    const movieEntity = new Movie();
    movieEntity.id = 'uuid';
    
    const dtoList = MoviesMapper.toDtoList([movieEntity]);
    expect(dtoList).toHaveLength(1);
    expect(dtoList[0].id).toBe('uuid');
  });
});
