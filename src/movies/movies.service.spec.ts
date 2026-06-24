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
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
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
});
