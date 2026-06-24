import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return mapped user profile', async () => {
      const mockUser = { id: 'uuid', name: 'Test', email: 'test@test.com' };
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.getProfile({ user: { id: 'uuid' } });
      
      expect(result.id).toEqual(mockUser.id);
      expect(result.name).toEqual(mockUser.name);
      expect(mockUsersService.findById).toHaveBeenCalledWith('uuid');
    });
  });
});
