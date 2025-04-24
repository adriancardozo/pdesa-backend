import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from 'src/app/app.controller';
import { AppService } from 'src/app/app.service';
import { mock } from 'test/resources/mocks/mock';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AppController],
    })
      .useMocker(mock)
      .compile();
    appService = module.get<AppService>(AppService);
    appController = module.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should delegate to service', () => {
      appController.version();
      expect(appService.version).toHaveBeenCalled();
    });
  });

  afterEach(async () => await module.close());
});
