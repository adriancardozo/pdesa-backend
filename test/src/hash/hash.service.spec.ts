import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'test/resources/mocks/mock';
import { HashService } from 'src/hash/hash.service';
import { compareResult, generatedSalt, password, passwordHash } from './test-data/hash.service.spec.data';
import bcryptModule from 'bcrypt';

describe('HashService', () => {
  let module: TestingModule;
  let service: HashService;
  let bcrypt: jest.Mocked<typeof bcryptModule>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [HashService],
    })
      .useMocker(mock)
      .compile();

    bcrypt = bcryptModule as jest.Mocked<typeof bcryptModule>;
    service = module.get<HashService>(HashService);
  });

  describe('Data', () => {
    beforeEach(() => {
      bcrypt.genSaltSync.mockReturnValue(generatedSalt);
      bcrypt.hash.mockResolvedValue(passwordHash);
    });

    it('should generate salt string', async () => {
      await service.data(password);
      expect(bcrypt.genSaltSync).toHaveBeenCalled();
    });

    it('should hash password with salt', async () => {
      await service.data(password);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, generatedSalt);
    });

    it('should return password hash', async () => {
      const result = await service.data(password);
      expect(result).toEqual(passwordHash);
    });
  });

  describe('Compare', () => {
    beforeEach(() => {
      bcrypt.compareSync.mockReturnValue(compareResult);
    });

    it('should compare password with hash', () => {
      service.compare(password, passwordHash);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, passwordHash);
    });

    it('should return compare result', () => {
      const result = service.compare(password, passwordHash);
      expect(result).toEqual(compareResult);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await module.close();
  });
});
