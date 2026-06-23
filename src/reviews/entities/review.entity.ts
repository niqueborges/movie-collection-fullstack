import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  Index
} from 'typeorm';

@Entity('reviews')
@Index(['userId', 'movieId'], { unique: true }) 
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  rating!: number;
 
  @Column({ type: 'text', nullable: true })
  comment!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'movie_id' })
  movieId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}