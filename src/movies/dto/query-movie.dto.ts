import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum SortMovieBy {
  TITLE = 'title',
  RELEASE_YEAR = 'releaseYear',
  AVERAGE_RATING = 'averageRating',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class QueryMovieDto {
  @ApiPropertyOptional({ description: 'Número da página', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Quantidade de itens por página', default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Buscar por título parcial' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Filtrar por gênero' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ano de lançamento' })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  releaseYear?: number;

  @ApiPropertyOptional({ description: 'Ordenar por um campo específico', enum: SortMovieBy })
  @IsOptional()
  @IsEnum(SortMovieBy)
  sortBy?: SortMovieBy;

  @ApiPropertyOptional({ description: 'Ordem da classificação', enum: SortOrder, default: SortOrder.ASC })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.ASC;
}
