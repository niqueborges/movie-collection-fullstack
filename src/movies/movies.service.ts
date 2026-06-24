import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    this.logger.log(
      `Attempting to create a new movie: ${createMovieDto.title}`,
    );
    const movie = this.moviesRepository.create(createMovieDto);
    const savedMovie = await this.moviesRepository.save(movie);
    this.logger.log(`Movie created successfully: ${savedMovie.id}`);
    return savedMovie;
  }

  async findAll(queryDto: QueryMovieDto) {
    this.logger.log(
      `Fetching movies with query parameters: ${JSON.stringify(queryDto)}`,
    );
    const {
      page = 1,
      limit = 10,
      title,
      genre,
      releaseYear,
      sortBy,
      order,
    } = queryDto;

    const query = this.moviesRepository.createQueryBuilder('movie');

    if (title) {
      query.andWhere('movie.title ILIKE :title', { title: `%${title}%` });
    }

    if (genre) {
      query.andWhere('movie.genre ILIKE :genre', { genre: `%${genre}%` });
    }

    if (releaseYear) {
      query.andWhere('movie.releaseYear = :releaseYear', { releaseYear });
    }

    if (sortBy) {
      query.orderBy(`movie.${sortBy}`, order);
    } else {
      query.orderBy('movie.createdAt', 'DESC');
    }

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();
    this.logger.log(`Found ${total} movies`);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Movie> {
    this.logger.log(`Fetching movie with ID: ${id}`);
    const movie = await this.moviesRepository.findOne({ where: { id } });
    if (!movie) {
      this.logger.warn(`Movie not found: ${id}`);
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    this.logger.log(`Updating movie with ID: ${id}`);
    const movie = await this.findOne(id);
    this.moviesRepository.merge(movie, updateMovieDto);
    const updatedMovie = await this.moviesRepository.save(movie);
    this.logger.log(`Movie updated successfully: ${id}`);
    return updatedMovie;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Attempting to soft delete movie with ID: ${id}`);
    const movie = await this.findOne(id);
    await this.moviesRepository.softRemove(movie);
    this.logger.log(`Movie soft deleted successfully: ${id}`);
  }
}
