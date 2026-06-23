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
  @ApiProperty({ example: 'Inception', description: 'The title of the movie' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'A thief who steals corporate secrets...', description: 'The description or synopsis of the movie' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 2010, description: 'Release year of the movie (1800 to current year)' })
  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear())
  releaseYear: number;

  @ApiProperty({ example: 'Science Fiction', description: 'Genre of the movie' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  genre: string;

  @ApiProperty({ example: 8880, description: 'Duration of the movie in seconds' })
  @IsInt()
  @IsPositive()
  durationSeconds: number;
}
