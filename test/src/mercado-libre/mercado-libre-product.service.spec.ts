import { Test, TestingModule } from '@nestjs/testing';
import { MercadoLibreProductService } from 'src/mercado-libre/mercado-libre-product.service';
import { mock } from 'test/resources/mocks/mock';
import { HttpService } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import {
  config,
  configuration,
  errors,
  getProductResult,
  getProductUrl,
  idMl,
  mlNotFoundError,
  query,
  refreshTokenBody,
  refreshTokenConfig,
  refreshTokenResult,
  refreshTokenUrl,
  searchResult,
  searchUrl,
  unauthorizedError,
} from './test-data/mercado-libre-product.service.spec.data';
import { of, throwError } from 'rxjs';
import { MercadoLibreSearchResult } from 'src/mercado-libre/entity/mercado-libre-search-result.entity';
import { ValidationService } from 'src/validation/validation.service';
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { MercadoLibreProduct } from 'src/mercado-libre/entity/mercado-libre-product.entity';
import { AxiosResponse } from 'axios';

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
          'body',
        );
      });

      describe('With authorization fail', () => {
        beforeEach(() => {
          httpService.post.mockReturnValue(
            of({ data: { refresh_token: 'refresh_token', access_token: 'access_token' } } as AxiosResponse),
          );
        });

        it('should try refresh token if fails with unauthorized error', async () => {
          validationService.transform.mockResolvedValue(refreshTokenResult);
          httpService.get.mockReturnValueOnce(throwError(() => unauthorizedError));
          await service.search(query);
          expect(httpService.post).toHaveBeenCalledWith(
            refreshTokenUrl,
            refreshTokenBody,
            refreshTokenConfig,
          );
        });
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

  describe('Get product', () => {
    describe('Without fail', () => {
      beforeEach(() => {
        httpService.get.mockReturnValue(of(getProductResult));
      });

      it('should delegate to Mercado Libre API', async () => {
        await service.getProduct(idMl);
        expect(httpService.get).toHaveBeenCalledWith(getProductUrl(idMl), config);
      });

      it('should validate response attributes', async () => {
        await service.getProduct(idMl);
        expect(validationService.transform).toHaveBeenCalledWith(
          getProductResult.data,
          MercadoLibreProduct,
          'body',
        );
      });

      describe('With authorization fail', () => {
        beforeEach(() => {
          httpService.post.mockReturnValue(
            of({ data: { refresh_token: 'refresh_token', access_token: 'access_token' } } as AxiosResponse),
          );
        });

        it('should try refresh token if fails with unauthorized error', async () => {
          validationService.transform.mockResolvedValue(refreshTokenResult);
          httpService.get.mockReturnValueOnce(throwError(() => unauthorizedError));
          await service.getProduct(idMl);
          expect(httpService.post).toHaveBeenCalledWith(
            refreshTokenUrl,
            refreshTokenBody,
            refreshTokenConfig,
          );
        });
      });
    });

    describe('With fail', () => {
      beforeEach(() => {
        httpService.get.mockReturnValue(throwError(() => new ServiceUnavailableException()));
      });

      it('should fail with not found if API fail with not found', async () => {
        httpService.get.mockReturnValue(throwError(() => mlNotFoundError));
        await expect(service.getProduct(idMl)).rejects.toMatchObject(
          new NotFoundException(errors.mlProductNotFound),
        );
      });

      it('should fail if API fail', async () => {
        await expect(service.getProduct(idMl)).rejects.toMatchObject(
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
