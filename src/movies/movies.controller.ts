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
  @ApiOperation({ summary: 'Cadastrar um novo filme' })
  @ApiResponse({ status: 201, description: 'Filme criado com sucesso', type: Movie })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar filmes com paginação e filtros' })
  @ApiResponse({ status: 200, description: 'Lista de filmes retornada com sucesso' })
  findAll(@Query() query: QueryMovieDto) {
    return this.moviesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um filme específico' })
  @ApiResponse({ status: 200, description: 'Filme retornado com sucesso', type: Movie })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar informações de um filme' })
  @ApiResponse({ status: 200, description: 'Filme atualizado com sucesso', type: Movie })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar um filme' })
  @ApiResponse({ status: 204, description: 'Filme deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
