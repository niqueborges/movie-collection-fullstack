import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Movie } from '../movies/entities/movie.entity';
import { BadRequestException } from '@nestjs/common';

const mockReviewsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockMoviesRepository = {
  update: jest.fn(),
};

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getRepositoryToken(Review),
          useValue: mockReviewsRepository,
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMoviesRepository,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should update existing review if user already reviewed the movie', async () => {
      const dto = { movieId: 'movie-1', rating: 4, comment: 'Good' };
      const existingReview = { id: 'rev-1', userId: 'user-1', movieId: 'movie-1' };
      
      jest.spyOn(service, 'findOneByUserIdAndMovieId').mockResolvedValue(existingReview as Review);
      jest.spyOn(service, 'recalculateAverageRating').mockResolvedValue(undefined);
      jest.spyOn(service, 'findOneById').mockResolvedValue({ ...existingReview, ...dto } as Review);

      const result = await service.create(dto, 'user-1');

      expect(mockReviewsRepository.update).toHaveBeenCalledWith('rev-1', dto);
      expect(service.recalculateAverageRating).toHaveBeenCalledWith('movie-1');
      expect(result.rating).toBe(4);
    });

    it('should create a new review if it does not exist', async () => {
      const dto = { movieId: 'movie-1', rating: 5, comment: 'Great' };
      
      jest.spyOn(service, 'findOneByUserIdAndMovieId').mockResolvedValue(null);
      mockReviewsRepository.create.mockReturnValue(dto);
      mockReviewsRepository.save.mockResolvedValue({ id: 'rev-1', ...dto, userId: 'user-1' });
      jest.spyOn(service, 'recalculateAverageRating').mockResolvedValue(undefined);

      const result = await service.create(dto, 'user-1');

      expect(mockReviewsRepository.create).toHaveBeenCalled();
      expect(mockReviewsRepository.save).toHaveBeenCalled();
      expect(service.recalculateAverageRating).toHaveBeenCalledWith('movie-1');
      expect(result.id).toBe('rev-1');
    });
  });

  describe('recalculateAverageRating', () => {
    it('should recalculate and update movie rating based on reviews', async () => {
      const reviews = [
        { rating: '4' },
        { rating: '5' }
      ];
      mockReviewsRepository.find.mockResolvedValue(reviews);

      await service.recalculateAverageRating('movie-1');

      expect(mockReviewsRepository.find).toHaveBeenCalledWith({ where: { movieId: 'movie-1' } });
      // Total = 4 + 5 = 9. TotalReviews = 2. Avg = 4.5
      expect(mockMoviesRepository.update).toHaveBeenCalledWith('movie-1', {
        averageRating: 4.5,
        totalReviews: 2,
      });
    });

    it('should set rating to 0 if no reviews exist', async () => {
      mockReviewsRepository.find.mockResolvedValue([]);

      await service.recalculateAverageRating('movie-1');

      expect(mockMoviesRepository.update).toHaveBeenCalledWith('movie-1', {
        averageRating: 0,
        totalReviews: 0,
      });
    });
  });

  describe('update', () => {
    it('should throw BadRequestException if user is not the author', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue({ id: 'rev-1', userId: 'user-2' } as Review);

      await expect(service.update('rev-1', { rating: 5 }, 'user-1')).rejects.toThrow(BadRequestException);
    });

    it('should update review and recalculate rating', async () => {
      const review = { id: 'rev-1', userId: 'user-1', movieId: 'movie-1' };
      jest.spyOn(service, 'findOneById').mockResolvedValue(review as Review);
      jest.spyOn(service, 'recalculateAverageRating').mockResolvedValue(undefined);

      await service.update('rev-1', { rating: 3 }, 'user-1');

      expect(mockReviewsRepository.update).toHaveBeenCalledWith('rev-1', { rating: 3 });
      expect(service.recalculateAverageRating).toHaveBeenCalledWith('movie-1');
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException if user is not the author', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue({ id: 'rev-1', userId: 'user-2' } as Review);

      await expect(service.remove('rev-1', 'user-1')).rejects.toThrow(BadRequestException);
    });

    it('should remove review and recalculate rating', async () => {
      const review = { id: 'rev-1', userId: 'user-1', movieId: 'movie-1' };
      jest.spyOn(service, 'findOneById').mockResolvedValue(review as Review);
      jest.spyOn(service, 'recalculateAverageRating').mockResolvedValue(undefined);

      await service.remove('rev-1', 'user-1');

      expect(mockReviewsRepository.delete).toHaveBeenCalledWith('rev-1');
      expect(service.recalculateAverageRating).toHaveBeenCalledWith('movie-1');
    });
  });

  describe('findOneById', () => {
    it('should throw BadRequestException if not found', async () => {
      mockReviewsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneById('rev-99')).rejects.toThrow(BadRequestException);
    });

    it('should return review if found', async () => {
      mockReviewsRepository.findOne.mockResolvedValue({ id: 'rev-1' });

      const result = await service.findOneById('rev-1');
      expect(result.id).toBe('rev-1');
    });
  });
});
