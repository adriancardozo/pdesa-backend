import { Test, TestingModule } from '@nestjs/testing';
import { MercadoLibreProductService } from 'src/mercado-libre/mercado-libre-product.service';
import { mock } from 'test/resources/mocks/mock';
import { HttpService } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import {
  config,
  configuration,
  errors,
  query,
  searchResult,
  searchUrl,
} from './test-data/mercado-libre-product.service.spec.data';
import { of, throwError } from 'rxjs';
import { MercadoLibreSearchResult } from 'src/mercado-libre/entity/mercado-libre-search-result.entity';
import { ValidationService } from 'src/validation/validation.service';
import { ServiceUnavailableException } from '@nestjs/common';

describe('MercadoLibreProductService', () => {
  let module: TestingModule;
  let httpService: jest.Mocked<HttpService>;
  let validationService: jest.Mocked<ValidationService>;
  let service: MercadoLibreProductService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] })],
      providers: [MercadoLibreProductService],
    })
      .useMocker(mock)
      .compile();

    validationService = module.get<jest.Mocked<ValidationService>>(ValidationService);
    httpService = module.get<jest.Mocked<HttpService>>(HttpService);
    service = module.get<MercadoLibreProductService>(MercadoLibreProductService);
  });

  describe('Search', () => {
    describe('Without fail', () => {
      beforeEach(() => {
        httpService.get.mockReturnValue(of(searchResult));
      });

      it('should delegate to Mercado Libre API', async () => {
        await service.search(query);
        expect(httpService.get).toHaveBeenCalledWith(searchUrl(query), config);
      });

      it('should validate response attributes', async () => {
        await service.search(query);
        expect(validationService.transform).toHaveBeenCalledWith(
          searchResult.data,
          MercadoLibreSearchResult,
        );
      });
    });

    describe('With fail', () => {
      beforeEach(() => {
        httpService.get.mockReturnValue(throwError(() => new ServiceUnavailableException()));
      });

      it('should fail if API fail', async () => {
        await expect(service.search(query)).rejects.toMatchObject(
          new ServiceUnavailableException(errors.mlServiceUnavailable),
        );
      });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => await module.close());
});
