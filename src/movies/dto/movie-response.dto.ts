import { ApiProperty } from '@nestjs/swagger';

export class MovieResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  releaseYear: number;

  @ApiProperty()
  genre: string;

  @ApiProperty()
  durationSeconds: number;

  @ApiProperty()
  averageRating: number;

  @ApiProperty()
  totalReviews: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
