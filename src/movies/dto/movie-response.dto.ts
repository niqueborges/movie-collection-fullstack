import { ApiProperty } from '@nestjs/swagger';

export class MovieResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'Inception' })
  title: string;

  @ApiProperty({ example: 'Christopher Nolan', required: false })
  director?: string;

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
