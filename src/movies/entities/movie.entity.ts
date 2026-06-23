import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('movies')
export class Movie {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Automatically generated UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Inception', description: 'The title of the movie' })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({ example: 'A thief who steals corporate secrets...', description: 'The description or synopsis of the movie' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ example: 2010, description: 'Release year of the movie' })
  @Column({ type: 'int', name: 'release_year' })
  releaseYear: number;

  @ApiProperty({ example: 'Science Fiction', description: 'Genre of the movie' })
  @Column({ type: 'varchar', length: 100 })
  genre: string;

  @ApiProperty({ example: 8880, description: 'Duration of the movie in seconds' })
  @Column({ type: 'int', name: 'duration_seconds' })
  durationSeconds: number;

  @ApiProperty({ example: 8.8, description: 'The average rating of the movie based on reviews' })
  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0, name: 'average_rating' })
  averageRating: number;

  @ApiProperty({ example: 42, description: 'The total number of reviews for the movie' })
  @Column({ type: 'int', default: 0, name: 'total_reviews' })
  totalReviews: number;

  @ApiProperty({ example: '2026-06-23T15:14:03.473Z' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-23T15:14:03.473Z' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
