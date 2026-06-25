import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistService } from './watchlist.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  remove: jest.fn(),
};

describe('WatchlistService', () => {
  let service: WatchlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchlistService,
        {
          provide: getRepositoryToken(Watchlist),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WatchlistService>(WatchlistService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addMovie', () => {
    it('should add a movie to watchlist successfully', async () => {
      const userId = 'user-123';
      const movieId = 'movie-123';
      const saved = { id: 'wl-1', userId, movieId, movie: null, createdAt: new Date(), updatedAt: new Date() };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(saved);
      mockRepository.save.mockResolvedValue(saved);

      const result = await service.addMovie(userId, movieId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { userId, movieId } });
      expect(result).toHaveProperty('id');
    });

    it('should throw ConflictException if movie already in watchlist', async () => {
      mockRepository.findOne.mockResolvedValue({ id: 'wl-1' });

      await expect(service.addMovie('user-123', 'movie-123')).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated watchlist', async () => {
      const items = [{ id: 'wl-1', userId: 'user-123', movieId: 'movie-123', movie: null, createdAt: new Date(), updatedAt: new Date() }];
      mockRepository.findAndCount.mockResolvedValue([items, 1]);

      const result = await service.findAll('user-123', 1, 10);

      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('removeMovie', () => {
    it('should remove a movie from watchlist successfully', async () => {
      const item = { id: 'wl-1', userId: 'user-123', movieId: 'movie-123' };
      mockRepository.findOne.mockResolvedValue(item);
      mockRepository.remove.mockResolvedValue(item);

      const result = await service.removeMovie('user-123', 'movie-123');

      expect(result).toEqual({ message: 'Movie removed successfully' });
    });

    it('should throw NotFoundException if movie not in watchlist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.removeMovie('user-123', 'movie-123')).rejects.toThrow(NotFoundException);
    });
  });
});