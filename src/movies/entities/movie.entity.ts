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
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID gerado automaticamente' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'A Origem', description: 'O título do filme' })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({ example: 'Um ladrão que rouba segredos corporativos...', description: 'A descrição/sinopse do filme' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ example: 2010, description: 'Ano de lançamento do filme' })
  @Column({ type: 'int', name: 'release_year' })
  releaseYear: number;

  @ApiProperty({ example: 'Ficção Científica', description: 'Gênero do filme' })
  @Column({ type: 'varchar', length: 100 })
  genre: string;

  @ApiProperty({ example: 8880, description: 'Duração do filme em segundos' })
  @Column({ type: 'int', name: 'duration_seconds' })
  durationSeconds: number;

  @ApiProperty({ example: 8.8, description: 'A nota média do filme baseada nas avaliações' })
  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0, name: 'average_rating' })
  averageRating: number;

  @ApiProperty({ example: 42, description: 'O número total de avaliações do filme' })
  @Column({ type: 'int', default: 0, name: 'total_reviews' })
  totalReviews: number;

  @ApiProperty({ example: '2026-06-23T15:14:03.473Z' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-23T15:14:03.473Z' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
