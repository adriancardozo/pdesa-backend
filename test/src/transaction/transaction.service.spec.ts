import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from 'src/transaction/transaction.service';
import { mock } from 'test/resources/mocks/mock';
import { DataSource, EntityManager } from 'typeorm';
import { callbackResult, transactionResult } from './test-data/transaction.service.spec.data';

describe('TransactionService', () => {
  let module: TestingModule;
  let callback: jest.Mock<Promise<any>, [EntityManager]>;
  let dataSource: jest.Mocked<DataSource>;
  let manager: jest.Mocked<EntityManager>;
  let service: TransactionService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [TransactionService],
    })
      .useMocker(mock)
      .compile();

    dataSource = module.get<jest.Mocked<DataSource>>(DataSource);
    service = module.get<TransactionService>(TransactionService);
  });

  describe('Transaction', () => {
    describe('With manager', () => {
      beforeEach(() => {
        manager = mock(EntityManager);
        callback = jest.fn();
        callback.mockResolvedValue(callbackResult);
      });

      it('should run into existing transaction', async () => {
        await service.transaction(callback, manager);
        expect(callback).toHaveBeenCalledWith(manager);
      });

      it('should return callback result', async () => {
        const result = await service.transaction(callback, manager);
        expect(result).toEqual(callbackResult);
      });
    });

    describe('Without manager', () => {
      beforeEach(() => {
        dataSource.transaction.mockResolvedValue(transactionResult);
      });

      it('should open a new transaction if not in existing one', async () => {
        await service.transaction(callback);
        expect(dataSource.transaction).toHaveBeenCalledWith(callback);
      });

      it('should return transaction result', async () => {
        const result = await service.transaction(callback);
        expect(result).toEqual(transactionResult);
      });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
