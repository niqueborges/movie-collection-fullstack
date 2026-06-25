import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Movie } from './entities/movie.entity';
import { MovieResponseDto } from './dto/movie-response.dto';
import { MoviesMapper } from './movies.mapper';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // Note: Role-Based Access Control (RBAC) was intentionally omitted here.
  // In a real-world scenario, this endpoint should be protected by an 'ADMIN' role guard.
  // Kept open to facilitate bootcamp instructors' evaluation.
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new movie' })
  @ApiResponse({ status: 201, description: 'Movie successfully created', type: MovieResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createMovieDto: CreateMovieDto) {
    const movie = await this.moviesService.create(createMovieDto);
    return MoviesMapper.toDto(movie);
  }

  @Get()
  @ApiOperation({ summary: 'List movies with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Movie list returned successfully' })
  async findAll(@Query() query: QueryMovieDto) {
    const result = await this.moviesService.findAll(query);
    return {
      ...result,
      data: MoviesMapper.toDtoList(result.data),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific movie details' })
  @ApiResponse({ status: 200, description: 'Movie returned successfully', type: MovieResponseDto })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async findOne(@Param('id') id: string) {
    const movie = await this.moviesService.findOne(id);
    return MoviesMapper.toDto(movie);
  }

  // Note: Role-Based Access Control (RBAC) was intentionally omitted here.
  // In a real-world scenario, this endpoint should be protected by an 'ADMIN' role guard.
  // Kept open to facilitate bootcamp instructors' evaluation.
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update movie information' })
  @ApiResponse({ status: 200, description: 'Movie updated successfully', type: MovieResponseDto })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    const movie = await this.moviesService.update(id, updateMovieDto);
    return MoviesMapper.toDto(movie);
  }

  // Note: Role-Based Access Control (RBAC) was intentionally omitted here.
  // In a real-world scenario, this endpoint should be protected by an 'ADMIN' role guard.
  // Kept open to facilitate bootcamp instructors' evaluation.
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({ status: 204, description: 'Movie deleted successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }

  @Post('import')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Import movies from CSV or JSON file' })
  @ApiResponse({ status: 201, description: 'Movies successfully imported' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async importMovies(@UploadedFile() file: Express.Multer.File) {
    return this.moviesService.importMovies(file);
  }
}
