import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMoviesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    importMovies: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call moviesService.create and return mapped dto', async () => {
      const dto = { title: 'Test', releaseYear: 2020 } as any;
      const movieEntity = { id: 'uuid', title: 'Test', releaseYear: 2020 };
      mockMoviesService.create.mockResolvedValue(movieEntity);

      const result = await controller.create(dto);
      expect(mockMoviesService.create).toHaveBeenCalledWith(dto);
      expect(result.title).toEqual('Test');
    });
  });

  describe('findAll', () => {
    it('should call moviesService.findAll and return paginated data', async () => {
      mockMoviesService.findAll.mockResolvedValue({ data: [{ id: '1', title: 'T' }], total: 1, page: 1, limit: 10 });
      const result = await controller.findAll({} as any);
      expect(mockMoviesService.findAll).toHaveBeenCalledWith({});
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should call moviesService.findOne', async () => {
      mockMoviesService.findOne.mockResolvedValue({ id: 'uuid', title: 'T' });
      const result = await controller.findOne('uuid');
      expect(mockMoviesService.findOne).toHaveBeenCalledWith('uuid');
      expect(result.title).toEqual('T');
    });
  });

  describe('update', () => {
    it('should call moviesService.update', async () => {
      mockMoviesService.update.mockResolvedValue({ id: 'uuid', title: 'Updated' });
      const result = await controller.update('uuid', { title: 'Updated' } as any);
      expect(mockMoviesService.update).toHaveBeenCalledWith('uuid', { title: 'Updated' });
      expect(result.title).toEqual('Updated');
    });
  });

  describe('remove', () => {
    it('should call moviesService.remove', async () => {
      mockMoviesService.remove.mockResolvedValue(undefined);
      await controller.remove('uuid');
      expect(mockMoviesService.remove).toHaveBeenCalledWith('uuid');
    });
  });

  describe('importMovies', () => {
    it('should call moviesService.importMovies', async () => {
      mockMoviesService.importMovies.mockResolvedValue({ imported: 5 });
      const result = await controller.importMovies({} as any);
      expect(mockMoviesService.importMovies).toHaveBeenCalled();
      expect(result.imported).toEqual(5);
    });
  });
});
