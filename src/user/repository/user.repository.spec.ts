import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [UserRepository]
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should get user by username', async() => {
    const mockUserId = 1;
    const mockUsername = 'user';
    const result = await repository.getUserByUsername(mockUsername);
    expect(result.id).toBe(mockUserId);
  });
});
