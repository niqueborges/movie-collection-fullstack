import { Injectable, BadRequestException } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {

    constructor(
        @InjectRepository(Review)
        private readonly reviewsRepository: Repository<Review>,
        @InjectRepository(Movie)
        private readonly moviesRepository: Repository<Movie>
    ) { }

   async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
        const existingReview = await this.findOneByUserIdAndMovieId(userId, createReviewDto.movieId);

        if (existingReview) {
            await this.reviewsRepository.update(existingReview.id, createReviewDto);
            await this.recalculateAverageRating(createReviewDto.movieId);
            return this.findOneById(existingReview.id);
        }

        const review = this.reviewsRepository.create({ ...createReviewDto, userId });
        const savedReview = await this.reviewsRepository.save(review);
        await this.recalculateAverageRating(createReviewDto.movieId); 
        return savedReview;
    }

    async findAllByUserId(userId: string): Promise<Review[]> {
        return this.reviewsRepository.find({
            where: { userId },
            relations: {
                movie: true,
            },
        });
    }

    async update(id: string, updateReviewDto: UpdateReviewDto, userId: string): Promise<Review> {
        const existingReview = await this.findOneById(id);
        
        if (existingReview.userId !== userId) {
            throw new BadRequestException('You can only update your own reviews.');
        }
        
        await this.reviewsRepository.update(id, updateReviewDto);
        await this.recalculateAverageRating(existingReview.movieId);
        return this.findOneById(id);
    }  

    async remove(id: string, userId: string): Promise<void> {
        const existingReview = await this.findOneById(id);
        
        if (existingReview.userId !== userId) {
            throw new BadRequestException('You can only delete your own reviews.');
        }
        
        await this.reviewsRepository.delete(id);
        await this.recalculateAverageRating(existingReview.movieId); 
    }

    async recalculateAverageRating(movieId: string): Promise<void   > {
        const reviews = await this.reviewsRepository.find({
            where: { movieId },
        });

        const totalReviews = reviews.length;
        let averageRating = 0;

        if (totalReviews > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
            averageRating = parseFloat((totalRating / totalReviews).toFixed(1));
        }

        await this.moviesRepository.update(movieId, {
            averageRating: averageRating, 
            totalReviews: totalReviews,
        });
    }

    async findOneById(id: string): Promise<Review> {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: { user: true, movie: true },
        });

        if (!review) {
            throw new BadRequestException('Review not found.');
        }

        return review;
    }

    async findOneByUserIdAndMovieId(userId: string, movieId: string): Promise<Review | null> {
        return this.reviewsRepository.findOne({
            where: { userId, movieId },
        });
    }

}