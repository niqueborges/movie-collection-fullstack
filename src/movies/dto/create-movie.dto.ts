import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'A Origem', description: 'O título do filme' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Um ladrão que rouba segredos corporativos...', description: 'A descrição/sinopse do filme' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 2010, description: 'Ano de lançamento do filme (1800 até o ano atual)' })
  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear())
  releaseYear: number;

  @ApiProperty({ example: 'Ficção Científica', description: 'Gênero do filme' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  genre: string;

  @ApiProperty({ example: 8880, description: 'Duração do filme em segundos' })
  @IsInt()
  @IsPositive()
  durationSeconds: number;
}
