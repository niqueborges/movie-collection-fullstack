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
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Movie } from './entities/movie.entity';
import { MoviesMapper } from './movies.mapper';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  private readonly logger = new Logger(MoviesController.name);

  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new movie' })
  @ApiResponse({
    status: 201,
    description: 'Movie successfully created',
    type: Movie,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createMovieDto: CreateMovieDto) {
    this.logger.log(
      `Received request to create movie: ${createMovieDto.title}`,
    );
    const movie = await this.moviesService.create(createMovieDto);
    return MoviesMapper.toDto(movie);
  }

  @Get()
  @ApiOperation({ summary: 'List movies with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Movie list returned successfully' })
  async findAll(@Query() query: QueryMovieDto) {
    this.logger.log(`Received request to list movies`);
    const result = await this.moviesService.findAll(query);
    return {
      ...result,
      data: result.data.map((movie) => MoviesMapper.toDto(movie)),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific movie details' })
  @ApiResponse({
    status: 200,
    description: 'Movie returned successfully',
    type: Movie,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Received request to get movie ID: ${id}`);
    const movie = await this.moviesService.findOne(id);
    return MoviesMapper.toDto(movie);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update movie information' })
  @ApiResponse({
    status: 200,
    description: 'Movie updated successfully',
    type: Movie,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    this.logger.log(`Received request to update movie ID: ${id}`);
    const movie = await this.moviesService.update(id, updateMovieDto);
    return MoviesMapper.toDto(movie);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({ status: 204, description: 'Movie deleted successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: string) {
    this.logger.log(`Received request to delete movie ID: ${id}`);
    await this.moviesService.remove(id);
  }
}
