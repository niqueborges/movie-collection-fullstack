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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Movie } from './entities/movie.entity';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new movie' })
  @ApiResponse({ status: 201, description: 'Movie successfully created', type: Movie })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'List movies with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Movie list returned successfully' })
  findAll(@Query() query: QueryMovieDto) {
    return this.moviesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific movie details' })
  @ApiResponse({ status: 200, description: 'Movie returned successfully', type: Movie })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update movie information' })
  @ApiResponse({ status: 200, description: 'Movie updated successfully', type: Movie })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

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
}
