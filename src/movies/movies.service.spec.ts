import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  const mockMovieRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    softRemove: jest.fn(),
    createQueryBuilder: jest.fn(),
    merge: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a movie if found', async () => {
      const mockMovie = { id: 'uuid', title: 'Inception' };
      mockMovieRepository.findOne.mockResolvedValue(mockMovie);

      const result = await service.findOne('uuid');
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a movie', async () => {
      const mockMovie = { id: 'uuid', title: 'Inception' };
      mockMovieRepository.findOne.mockResolvedValue(mockMovie);
      mockMovieRepository.softRemove.mockResolvedValue(mockMovie);

      await service.remove('uuid');
      expect(mockMovieRepository.softRemove).toHaveBeenCalledWith(mockMovie);
    });
  });

  describe('create', () => {
    it('should create and return a movie', async () => {
      const dto = {
        title: 'Test',
        description: 'Desc',
        releaseYear: 2020,
        genre: 'Action',
        durationInSeconds: 120,
      };
      const savedMovie = { id: 'uuid', ...dto };
      mockMovieRepository.create.mockReturnValue(savedMovie);
      mockMovieRepository.save.mockResolvedValue(savedMovie);

      const result = await service.create(dto as any);
      expect(result).toEqual(savedMovie);
      expect(mockMovieRepository.save).toHaveBeenCalledWith(savedMovie);
    });
  });

  describe('findAll', () => {
    it('should return paginated movies', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([[{ id: '1', title: 'Test' }], 1]),
      };
      mockMovieRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      const result = await service.findAll({
        page: 1,
        limit: 10,
        title: 'Test',
        genre: 'Action',
        releaseYear: 2020,
      });
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(3);
    });
  });

  describe('update', () => {
    it('should update and return a movie', async () => {
      const mockMovie = { id: 'uuid', title: 'Old' };
      const dto = { title: 'New' };
      mockMovieRepository.findOne.mockResolvedValue(mockMovie);
      mockMovieRepository.merge.mockImplementation((obj, updates) =>
        Object.assign(obj, updates),
      );
      mockMovieRepository.save.mockResolvedValue({ ...mockMovie, ...dto });

      const result = await service.update('uuid', dto);
      expect(result.title).toBe('New');
    });
  });
});
