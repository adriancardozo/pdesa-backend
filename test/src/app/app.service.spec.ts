import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from 'src/app/app.service';
import { mock } from 'test/resources/mocks/mock';
import { configuration, version } from './test-data/app.service.spec.data';

describe('AppService', () => {
  let module: TestingModule;
  let service: AppService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] })],
      providers: [AppService],
    })
      .useMocker(mock)
      .compile();

    service = module.get<AppService>(AppService);
  });

  describe('Version', () => {
    it('should return configuration version', () => {
      expect(service.version()).toMatch(version);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
