import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../user/repository/user.repository';
import { AuthService } from './auth.service';
import { User } from '../../user/model/user';

const mockUser: User = {
  id: 1,
  username: 'user',
  password: 'user'
};

const mockUserRepository = jest.fn().mockReturnValue({
  getUserByUsername: jest.fn((value) => value),
});

const mockJwtService = jest.fn().mockReturnValue({
  sign: jest.fn((value) => value),
});

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { 
          provide: JwtService,
          useClass: mockJwtService
        },
        { 
          provide: UserRepository,
          useClass: mockUserRepository
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    repository = module.get<UserRepository>(UserRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user when user exists', async() => {
    jest
      .spyOn(repository, 'getUserByUsername')
      .mockImplementation(() => Promise.resolve(mockUser));

    const result = await service.validateUser(mockUser.username, mockUser.password);
    expect(result.id).toBe(mockUser.id);
  });

  it('should validate user when user does not exist', async() => {
    jest
      .spyOn(repository, 'getUserByUsername')
      .mockImplementation(() => null);

    const result = await service.validateUser(mockUser.username, mockUser.password);
    expect(result).toBeFalsy();
  });

  it('should generate access token', async() => {
    const mockAccessToken = 'access token';
    jest
      .spyOn(jwtService, 'sign')
      .mockImplementation(() => mockAccessToken);
    const result = await service.loginWithCredentials(mockUser);
    expect(result.accessToken).toBe(mockAccessToken);
  });
});
