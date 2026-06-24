import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {

    constructor(
        @InjectRepository(Review)
        private readonly reviewsRepository: Repository<Review>,
    ) { }

    async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
        const existingReview = await this.findOneByUserIdAndMovieId(userId, createReviewDto.movieId);
        if (existingReview) {
            throw new ConflictException('A review for this movie by the same user already exists.');
        }

        const review = this.reviewsRepository.create({ ...createReviewDto, userId });
    
        return this.reviewsRepository.save(review);
    }

    async findAllByMovieId(movieId: string): Promise<Review[]> {
        return this.reviewsRepository.find({
            where: { movieId },
            relations: {
                user: true,
                movie: true,
            },
        });
    }

    async findOneByUserIdAndMovieId(userId: string, movieId: string): Promise<Review | null> {
        return this.reviewsRepository.findOne({
            where: { userId, movieId },
            relations: {
                user: true,
                movie: true,
            },
        });
    }

    async findOneById(id: string): Promise<Review | null> {
        const existingReview = await this.reviewsRepository.findOne({
            where: { id },
            relations: { user: true, movie: true },
        });

        if (!existingReview) {
            throw new BadRequestException('Review not found.');
        }   

        return existingReview; 
    }

    async update(id: string, updateReviewDto: Partial<CreateReviewDto>, userId: string): Promise<Review> {
        const existingReview = await this.findOneById(id);
        
        if (existingReview!.userId !== userId)  {
            throw new BadRequestException('You can only update your own reviews.');
        }
        
        await this.reviewsRepository.update(id, updateReviewDto);
        return this.findOneById(id) as Promise<Review>;
    }  

    async remove(id: string, userId: string): Promise<void> {
        const existingReview = await this.findOneById(id); 
        
        if (existingReview!.userId !== userId) {
            throw new BadRequestException('You can only delete your own reviews.');
        }
        
        await this.reviewsRepository.delete(id);
    }
}
