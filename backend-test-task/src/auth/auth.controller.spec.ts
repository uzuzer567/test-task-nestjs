import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';

const mockAuthService = jest.fn().mockReturnValue({
  loginWithCredentials: jest.fn().mockResolvedValue({
    accessToken: 'mock access token'
  })
});

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService()
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login', async() => {
    const mockUser = {
      username: 'user',
      password: 'user'
    }
    const result = await controller.login(mockUser);
    expect(service.loginWithCredentials).toBeCalledTimes(1);
    expect(result.accessToken).toBe('mock access token');
  });
});
