import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';

const mockWatchlistService = {
  addMovie: jest.fn(),
  findAll: jest.fn(),
  removeMovie: jest.fn(),
};

describe('WatchlistController', () => {
  let controller: WatchlistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchlistController],
      providers: [
        {
          provide: WatchlistService,
          useValue: mockWatchlistService,
        },
      ],
    }).compile();

    controller = module.get<WatchlistController>(WatchlistController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addMovie', () => {
    it('should call service.addMovie with correct params', async () => {
      const req = { user: { id: 'user-123' } };
      const body = { movieId: 'movie-123' };
      mockWatchlistService.addMovie.mockResolvedValue({ id: 'wl-1' });

      await controller.addMovie(req as any, body);

      expect(mockWatchlistService.addMovie).toHaveBeenCalledWith('user-123', 'movie-123');
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with correct params', async () => {
      const req = { user: { id: 'user-123' } };
      const query = { page: 1, limit: 10 };
      mockWatchlistService.findAll.mockResolvedValue({ total: 0, page: 1, limit: 10, data: [] });

      await controller.findAll(req as any, query as any);

      expect(mockWatchlistService.findAll).toHaveBeenCalledWith('user-123', 1, 10);
    });
  });

  describe('removeMovie', () => {
    it('should call service.removeMovie with correct params', async () => {
      const req = { user: { id: 'user-123' } };
      mockWatchlistService.removeMovie.mockResolvedValue({ message: 'Movie removed successfully' });

      await controller.removeMovie(req as any, 'movie-123');

      expect(mockWatchlistService.removeMovie).toHaveBeenCalledWith('user-123', 'movie-123');
    });
  });
});