import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';
import { Movie } from './entities/movie.entity';
import * as Papa from 'papaparse';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
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
    const movie = await this.findOne(id);
    await this.moviesRepository.remove(movie);
  }

  async importMovies(file: Express.Multer.File): Promise<{ imported: number }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const ext = file.originalname.split('.').pop()?.toLowerCase();
    const content = file.buffer.toString('utf-8');
    let moviesData: any[] = [];

    if (ext === 'json') {
      try {
        moviesData = JSON.parse(content);
        if (!Array.isArray(moviesData)) {
          moviesData = [moviesData];
        }
      } catch (err) {
        throw new BadRequestException('Invalid JSON format');
      }
    } else if (ext === 'csv') {
      const parsed = Papa.parse(content, { header: true, skipEmptyLines: true });
      if (parsed.errors.length > 0) {
        throw new BadRequestException('Invalid CSV format');
      }
      moviesData = parsed.data;
    } else {
      throw new BadRequestException('Unsupported file format. Use CSV or JSON');
    }

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
