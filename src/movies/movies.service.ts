import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';
import { Movie } from './entities/movie.entity';
import { MovieFileParser } from './utils/file-parser.util';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    this.logger.log(`Creating new movie: ${createMovieDto.title}`);
    const movie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository.save(movie);
  }

  async findAll(queryDto: QueryMovieDto) {
    const { page = 1, limit = 10, title, genre, releaseYear, sortBy, order } = queryDto;
    
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

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Movie> {
    this.logger.log(`Fetching movie by ID: ${id}`);
    const movie = await this.moviesRepository.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);
    this.moviesRepository.merge(movie, updateMovieDto);
    return this.moviesRepository.save(movie);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Attempting to remove movie with ID: ${id}`);
    const movie = await this.findOne(id);
    await this.moviesRepository.softRemove(movie);
  }

  async importMovies(file: Express.Multer.File): Promise<{ imported: number }> {
    this.logger.log(`Starting movie import from file: ${file.originalname}`);
    const moviesData = MovieFileParser.parse(file);

    let importedCount = 0;
    for (const data of moviesData) {
      // Basic validation and mapping
      const dto = new CreateMovieDto();
      dto.title = data.title;
      dto.description = data.description;
      dto.releaseYear = parseInt(data.releaseYear, 10);
      dto.genre = data.genre;
      dto.durationSeconds = parseInt(data.durationSeconds, 10);

      if (dto.title && dto.description && !isNaN(dto.releaseYear) && dto.genre && !isNaN(dto.durationSeconds)) {
        await this.create(dto);
        importedCount++;
      }
    }

    return { imported: importedCount };
  }
}
